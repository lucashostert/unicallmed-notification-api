const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

// Inicializar Firebase Admin (Vercel vai injetar as credenciais via env)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    }),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
  });
}

const db = admin.firestore();
const messaging = admin.messaging();

module.exports = async (req, res) => {
  return cors(req, res, async () => {
    // Aceitar apenas POST
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const { userId, message, title, type } = req.body;

      // Validação
      if (!userId || !message) {
        return res.status(400).json({ 
          error: 'userId e message são obrigatórios' 
        });
      }

      // Buscar FCM token do usuário no Firestore
      const userDoc = await db.collection('users').doc(userId).get();
      
      if (!userDoc.exists) {
        return res.status(404).json({ 
          error: 'Usuário não encontrado' 
        });
      }

      const fcmToken = userDoc.data().fcmToken;

      if (!fcmToken) {
        return res.json({
          success: true,
          message: 'Usuário sem token FCM',
          sent: false
        });
      }

      // Preparar notificação
      const notification = {
        token: fcmToken,
        notification: {
          title: title || '📢 Aviso Administrativo',
          body: message
        },
        data: {
          type: type || 'admin_alert',
          message: message,
          timestamp: Date.now().toString()
        },
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
            channelId: type === 'mining_stopped' ? 'admin_actions' : 'admin_alerts'
          }
        },
        apns: {
          payload: {
            aps: {
              badge: 1,
              sound: 'default'
            }
          }
        }
      };

      // Enviar via FCM
      await messaging.send(notification);

      console.log('✅ Notificação enviada para:', userId);

      return res.json({
        success: true,
        message: 'Notificação enviada com sucesso',
        sent: true
      });

    } catch (error) {
      console.error('❌ Erro:', error);
      return res.status(500).json({
        error: 'Erro ao enviar notificação',
        details: error.message
      });
    }
  });
};
