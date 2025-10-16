# 🔔 UniCallMed Notification API

API simples hospedada na Vercel para enviar notificações push via Firebase Cloud Messaging.

## 🚀 Deploy na Vercel (5 minutos)

### **1. Instalar Vercel CLI**

```bash
npm install -g vercel
```

### **2. Login na Vercel**

```bash
vercel login
```

### **3. Obter Credenciais do Firebase**

1. Acessar: https://console.firebase.google.com/project/app-unicallmed/settings/serviceaccounts/adminsdk
2. Clicar em **"Gerar nova chave privada"**
3. Baixar arquivo JSON

O arquivo terá algo como:

```json
{
  "type": "service_account",
  "project_id": "app-unicallmed",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@app-unicallmed.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "...",
  "token_uri": "...",
  "auth_provider_x509_cert_url": "...",
  "client_x509_cert_url": "..."
}
```

### **4. Deploy**

```bash
cd unicallmed-notification-api
vercel
```

Responda:
- **Set up and deploy?** → Y
- **Which scope?** → Sua conta
- **Link to existing project?** → N
- **Project name?** → unicallmed-notification-api
- **Directory?** → ./
- **Override settings?** → N

### **5. Adicionar Variáveis de Ambiente**

```bash
vercel env add FIREBASE_PROJECT_ID
# Digite: app-unicallmed

vercel env add FIREBASE_CLIENT_EMAIL
# Digite: o valor de "client_email" do JSON

vercel env add FIREBASE_PRIVATE_KEY
# Digite: o valor de "private_key" do JSON (com as quebras de linha \n)
```

**Importante:** Para `FIREBASE_PRIVATE_KEY`, copie o valor EXATO do JSON, incluindo:
```
-----BEGIN PRIVATE KEY-----\nMIIEvQIBA...\n-----END PRIVATE KEY-----\n
```

### **6. Fazer Deploy Novamente (com variáveis)**

```bash
vercel --prod
```

### **7. Copiar URL**

A Vercel vai dar uma URL tipo:
```
https://unicallmed-notification-api.vercel.app
```

---

## 📡 Usar no Admin

Atualizar `AdminService.js`:

```javascript
// Enviar aviso
const response = await fetch(
  'https://unicallmed-notification-api.vercel.app/api/send-notification',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: 'USER_ID',
      message: 'Sua mensagem aqui',
      title: '📢 Aviso Administrativo',
      type: 'admin_alert'
    })
  }
)

const result = await response.json()
console.log(result) // { success: true, sent: true }
```

---

## 🧪 Testar

```bash
curl -X POST https://unicallmed-notification-api.vercel.app/api/send-notification \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "SEU_USER_ID",
    "message": "Teste de notificação",
    "title": "Teste",
    "type": "admin_alert"
  }'
```

---

## ✅ Vantagens

- ✅ **100% Gratuito** (Vercel free tier)
- ✅ **Sem CORS** (API própria com CORS configurado)
- ✅ **Sem permissões especiais** (não usa Firebase CLI)
- ✅ **Deploy em 5 minutos**
- ✅ **Funciona com app fechado** (push notification real)
- ✅ **HTTPS automático**
- ✅ **Escalável** (Vercel serverless)

---

## 📊 Limites Vercel Free

- **100 GB bandwidth/mês** (mais que suficiente)
- **100 deployments/dia**
- **Unlimited requests**
- **Serverless functions: 10s timeout**

**Para notificações push:** Totalmente viável! 🎉
