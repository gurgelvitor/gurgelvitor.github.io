# Deploy no Vercel - GurgelTrack

## 🚀 Passo a Passo para Deploy

### 1. Preparação do Projeto

O projeto já está configurado com:
- ✅ `vercel.json` - Configuração do Vercel
- ✅ `package.json` atualizado com script `vercel-build`
- ✅ `.env.vercel` - Template de variáveis de ambiente

### 2. Instalar Vercel CLI

```bash
npm install -g vercel
```

### 3. Fazer Login no Vercel

```bash
vercel login
```

### 4. Configurar Variáveis de Ambiente

No painel do Vercel (vercel.com):
1. Vá para o seu projeto
2. Settings → Environment Variables
3. Adicione as seguintes variáveis:

```
SUPABASE_URL=https://erhhavvueccaqenzgspp.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyaGhhdnZ1ZWNjYXFlbnpnc3BwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxNTYwMzcsImV4cCI6MjA5MjczMjAzN30.6o4n-UWfmlhysGdg1JC2CHH3TgVqhnjXSZTgNsMlBcg
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyaGhhdnZ1ZWNjYXFlbnpnc3BwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzE1NjAzNywiZXhwIjoyMDkyNzMyMDM3fQ.h9BwrTDXDQUHYBClC8raJiN4UqQuz9vaX1t0GM4kMcw
NODE_ENV=production
JWT_SECRET=gurgeltrack-secret-key-change-in-production-secure-random-string
```

**⚠️ IMPORTANTE:** Mude o `JWT_SECRET` para uma string segura e aleatória!

### 5. Deploy Inicial

```bash
# No diretório do projeto
vercel

# Siga as instruções:
# - Link to existing project? N
# - What's your project's name? gurgeltrack
# - In which directory is your code located? ./
# - Want to override the settings? N
```

### 6. Deploy Automático (Git)

Se você usa Git:

```bash
# Adicionar Vercel ao projeto
vercel --prod

# Fazer commit e push
git add .
git commit -m "Deploy no Vercel"
git push origin main
```

## 🔧 Configurações Específicas

### vercel.json

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ]
}
```

### Estrutura de Arquivos

```
waylowinicio/
├── server.js              # Servidor Express
├── vercel.json           # Config Vercel
├── package.json          # Dependências
├── .env.vercel          # Variáveis de ambiente (template)
├── index.html           # Página principal
├── alunos.html          # Gestão de alunos
├── treino.html          # Fichas de treino
├── dieta.html           # Planejamento dietético
├── calculo.html         # Cálculos energéticos
├── carga.html           # Anotações de peso
├── pagamentos.html      # Controle financeiro
├── agenda.html          # Agenda
├── login.html           # Autenticação
├── js/                  # Scripts JavaScript
├── css/                 # Estilos
└── img/                 # Imagens
```

## 🌐 URLs Após Deploy

- **Aplicação:** `https://gurgeltrack.vercel.app`
- **API:** `https://gurgeltrack.vercel.app/api/*`
- **Login:** `https://gurgeltrack.vercel.app/login.html`

## 🛠️ Comandos Úteis

```bash
# Deploy de produção
vercel --prod

# Ver logs
vercel logs

# Verificar domínio
vercel domains

# Listar projetos
vercel list
```

## ⚠️ Considerações de Produção

1. **Segurança:** Mude o `JWT_SECRET` para algo realmente seguro
2. **HTTPS:** O Vercel já fornece HTTPS automático
3. **Performance:** O Vercel faz cache automático de assets estáticos
4. **Logs:** Monitore os logs no painel do Vercel
5. **Domínio:** Você pode configurar um domínio customizado

## 🔍 Teste Pós-Deploy

1. Acesse a URL do projeto
2. Teste login/cadastro
3. Verifique funcionalidades CRUD
4. Confirme alternância de tema
5. Teste responsive design

## 📞 Suporte

Se tiver problemas:
- Verifique os logs no painel Vercel
- Confirme as variáveis de ambiente
- Teste localmente antes do deploy
- Use `vercel logs --follow` para logs em tempo real
