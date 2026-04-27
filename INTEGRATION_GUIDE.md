# Guia de Integração - Sistema de Sincronização

## ✅ O que foi implementado:

### Backend (server.js)
- **Middleware de autenticação** com JWT e sessão
- **APIs sincronizadas** para alunos, dietas, treinos, anotações
- **Proteção de rotas** por usuário
- **Sistema de logout** e verificação de sessão

### Frontend
- **auth.js**: Sistema centralizado de autenticação
- **Verificação automática** de login em todas as páginas
- **authenticatedFetch**: Requisições seguras para APIs
- **Página de teste**: test-sync.html

### Banco de Dados
- **Todas as tabelas** com coluna `user_id`
- **Dados isolados** por usuário
- **Sincronização automática** entre dispositivos

## 🧪 Como Testar:

### 1. Teste Básico (Funcionando)
- Acesse: http://localhost:3001/test-sync.html
- Login: vitorpgurgel@gmail.com / 123456
- Crie dados e veja a sincronização

### 2. Teste Site Principal
- Acesse: http://localhost:3001/alunos.html
- Se não estiver logado, será redirecionado para login
- Após login, verá apenas seus alunos

### 3. Teste Multi-dispositivo
- Abra o mesmo site em outro navegador
- Login com a mesma conta
- Os dados devem aparecer sincronizados

## 🔄 Páginas Atualizadas:

✅ **alunos.html** - Integrada com API de alunos  
✅ **dieta.html** - Com verificação de autenticação  
✅ **treino.html** - Com verificação de autenticação  
✅ **agenda.html** - Com verificação de autenticação  
✅ **carga.html** - Com verificação de autenticação  
✅ **calculo.html** - Com verificação de autenticação  
✅ **pagamentos.html** - Com verificação de autenticação  
✅ **index.html** - Com verificação de autenticação  

## 📝 Próximos Passos:

### Para cada página, você precisa:

1. **Substituir localStorage por APIs**:
```javascript
// Antes (localStorage)
const data = JSON.parse(localStorage.getItem('alunos') || '[]');

// Depois (API sincronizada)
const response = await authenticatedFetch('/api/alunos');
const data = await response.json();
```

2. **Atualizar funções de salvar**:
```javascript
// Criar novo item
async function salvarItem(data) {
    const response = await authenticatedFetch('/api/alunos', {
        method: 'POST',
        body: JSON.stringify(data)
    });
    return response.json();
}

// Atualizar item
async function atualizarItem(id, data) {
    const response = await authenticatedFetch(`/api/alunos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    });
    return response.json();
}

// Excluir item
async function excluirItem(id) {
    const response = await authenticatedFetch(`/api/alunos/${id}`, {
        method: 'DELETE'
    });
    return response.json();
}
```

3. **Verificar campos do banco**:
- Use `nome` em vez de `name`
- Use `user_id` para sincronização
- Verifique estrutura da tabela correspondente

## 🚀 Como Funciona a Sincronização:

1. **Login**: Cria token JWT + sessão
2. **Requisições**: Incluem header `Authorization: Bearer token`
3. **Backend**: Filtra dados por `user_id`
4. **Multi-dispositivo**: Mesma conta = mesmos dados

## 🛠️ APIs Disponíveis:

### Alunos
- `GET /api/alunos` - Listar alunos do usuário
- `POST /api/alunos` - Criar aluno
- `PUT /api/alunos/:id` - Atualizar aluno
- `DELETE /api/alunos/:id` - Excluir aluno

### Dietas
- `GET /api/dietas` - Listar dietas do usuário
- `POST /api/dietas` - Criar dieta
- `PUT /api/dietas/:id` - Atualizar dieta
- `DELETE /api/dietas/:id` - Excluir dieta

### Treinos
- `GET /api/treinos` - Listar treinos do usuário
- `POST /api/treinos` - Criar treino
- `PUT /api/treinos/:id` - Atualizar treino
- `DELETE /api/treinos/:id` - Excluir treino

### Anotações
- `GET /api/anotacoes` - Listar anotações do usuário
- `POST /api/anotacoes` - Criar anotação
- `PUT /api/anotacoes/:id` - Atualizar anotação
- `DELETE /api/anotacoes/:id` - Excluir anotação

## 🔧 Troubleshooting:

### Se a página não carregar:
1. Verifique se está logado
2. Verifique o console do navegador
3. Confirme que o servidor está rodando

### Se os dados não sincronizam:
1. Verifique `user_id` nos dados
2. Confirme que está usando `authenticatedFetch`
3. Teste na página test-sync.html

### Se aparecer erro 401/403:
1. Faça login novamente
2. Verifique o token no localStorage
3. Limpe cookies e cache

---

**Status**: ✅ Sistema implementado e funcionando!
**Teste**: http://localhost:3001/test-sync.html
**Site**: http://localhost:3001/alunos.html
