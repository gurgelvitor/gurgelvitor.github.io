# Deploy no Vercel - Guia Completo

## 📋 Pré-requisitos

1. **Conta no Vercel**: [vercel.com](https://vercel.com)
2. **GitHub**: Repositório com seu código
3. **Supabase**: Database configurado

---

## 🚀 Passo a Passo

### 1. Preparar Repositório

```bash
# Se ainda não tiver Git
git init
git add .
git commit -m "Deploy preparation for Vercel"

# Adicionar repositório remoto
git remote add origin https://github.com/seu-usuario/gurgeltrack.git
git push -u origin main
```

### 2. Conectar com Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Faça login com GitHub
3. Clique em **"New Project"**
4. Selecione seu repositório `gurgeltrack`

### 3. Configurar Build

Vercel detectará automaticamente:
- **Framework**: Other
- **Root Directory**: `./`
- **Build Command**: (deixe em branco)
- **Output Directory**: (deixe em branco)
- **Install Command**: `npm install`

### 4. Configurar Variáveis de Ambiente

No painel do Vercel, vá em **Settings > Environment Variables** e adicione:

```
NODE_ENV=production
JWT_SECRET=sua_chave_secreta_aqui_minimo_32_caracteres
SUPABASE_URL=sua_url_supabase_aqui
SUPABASE_ANON_KEY=sua_chave_anon_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_supabase
PORT=3000
```

### 5. Deploy

Clique em **"Deploy"** e aguarde o build.

---

## 🔧 Arquivos de Configuração

### vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    },
    {
      "src": "**/*.html",
      "use": "@vercel/static"
    },
    {
      "src": "**/*.css",
      "use": "@vercel/static"
    },
    {
      "src": "**/*.js",
      "use": "@vercel/static"
    },
    {
      "src": "img/**/*",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "server.js": {
      "maxDuration": 10
    }
  }
}
```

---

## ⚠️ Configurações Importantes

### Supabase
- URL: `https://seu-projeto.supabase.co`
- Anon Key: Chave pública
- Service Role Key: Chave privada (admin)

### JWT Secret
Use uma chave forte:
```bash
# Gerar chave segura
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🐛 Problemas Comuns

### 1. CORS Error
Verifique se o CORS está configurado no server.js:
```javascript
app.use(cors());
```

### 2. Database Connection
Verifique variáveis de ambiente no painel Vercel.

### 3. Static Files
Se arquivos CSS/JS não carregarem, verifique rotas no vercel.json.

### 4. API Routes
Se APIs não funcionarem, verifique se as rotas começam com `/api/`.

---

## 🔄 Deploy Automático

Configure automatic deploy:
1. No Vercel, vá em **Settings > Git**
2. Conecte seu branch `main`
3. Ative **"Automatic Deploy"**

Agora cada `git push` atualizará sua aplicação!

---

## 📱 Acessar Aplicação

Após deploy, sua aplicação estará disponível em:
- URL: `https://seu-projeto.vercel.app`
- Domínio personalizado: Configure em **Settings > Domains**

---

## 🛠️ Comandos Úteis

```bash
# Ver logs de deploy
vercel logs

# Fazer deploy manual
vercel --prod

# Ver variáveis de ambiente
vercel env ls

# Adicionar variável de ambiente
vercel env add JWT_SECRET
```

---

## 📞 Suporte

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Issues**: Verifique logs no painel Vercel

---

## ✅ Checklist Final

- [ ] Repositório no GitHub
- [ ] Arquivos de configuração criados
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy realizado com sucesso
- [ ] APIs funcionando
- [ ] Páginas estáticas carregando
- [ ] Autenticação funcionando

**Sua aplicação GurgelTrack está no ar! 🎉**
