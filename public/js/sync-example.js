// Exemplo de como usar as APIs sincronizadas por usuário
// Este arquivo demonstra como integrar o sistema de sincronização nas páginas existentes

// Verificar autenticação antes de carregar dados
function requireAuth() {
    if (!auth.isAuthenticated()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Exemplo: Carregar alunos do usuário logado
async function carregarAlunos() {
    if (!requireAuth()) return;
    
    try {
        const response = await authenticatedFetch('/api/alunos');
        const alunos = await response.json();
        
        // Renderizar alunos na interface
        renderizarAlunos(alunos);
    } catch (error) {
        console.error('Erro ao carregar alunos:', error);
        mostrarErro('Não foi possível carregar os alunos');
    }
}

// Exemplo: Criar novo aluno
async function criarAluno(alunoData) {
    if (!requireAuth()) return;
    
    try {
        const response = await authenticatedFetch('/api/alunos', {
            method: 'POST',
            body: JSON.stringify(alunoData)
        });
        
        const novoAluno = await response.json();
        
        // Atualizar interface
        adicionarAlunoNaLista(novoAluno);
        mostrarSucesso('Aluno criado com sucesso!');
        
        // Sincronização automática: outros dispositivos verão este aluno
        console.log('Aluno sincronizado para todos os dispositivos do usuário');
        
    } catch (error) {
        console.error('Erro ao criar aluno:', error);
        mostrarErro('Não foi possível criar o aluno');
    }
}

// Exemplo: Atualizar aluno
async function atualizarAluno(id, alunoData) {
    if (!requireAuth()) return;
    
    try {
        const response = await authenticatedFetch(`/api/alunos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(alunoData)
        });
        
        const alunoAtualizado = await response.json();
        
        // Atualizar interface
        atualizarAlunoNaLista(id, alunoAtualizado);
        mostrarSucesso('Aluno atualizado com sucesso!');
        
    } catch (error) {
        console.error('Erro ao atualizar aluno:', error);
        mostrarErro('Não foi possível atualizar o aluno');
    }
}

// Exemplo: Excluir aluno
async function excluirAluno(id) {
    if (!requireAuth()) return;
    
    if (!confirm('Tem certeza que deseja excluir este aluno?')) return;
    
    try {
        const response = await authenticatedFetch(`/api/alunos/${id}`, {
            method: 'DELETE'
        });
        
        // Remover da interface
        removerAlunoDaLista(id);
        mostrarSucesso('Aluno excluído com sucesso!');
        
    } catch (error) {
        console.error('Erro ao excluir aluno:', error);
        mostrarErro('Não foi possível excluir o aluno');
    }
}

// Funções similares para outros módulos (dietas, treinos, anotações)

// Dietas
async function carregarDietas() {
    if (!requireAuth()) return;
    
    try {
        const response = await authenticatedFetch('/api/dietas');
        const dietas = await response.json();
        renderizarDietas(dietas);
    } catch (error) {
        console.error('Erro ao carregar dietas:', error);
    }
}

async function criarDieta(dietaData) {
    if (!requireAuth()) return;
    
    try {
        const response = await authenticatedFetch('/api/dietas', {
            method: 'POST',
            body: JSON.stringify(dietaData)
        });
        
        const novaDieta = await response.json();
        adicionarDietaNaLista(novaDieta);
        mostrarSucesso('Dieta criada com sucesso!');
    } catch (error) {
        console.error('Erro ao criar dieta:', error);
        mostrarErro('Não foi possível criar a dieta');
    }
}

// Treinos
async function carregarTreinos() {
    if (!requireAuth()) return;
    
    try {
        const response = await authenticatedFetch('/api/treinos');
        const treinos = await response.json();
        renderizarTreinos(treinos);
    } catch (error) {
        console.error('Erro ao carregar treinos:', error);
    }
}

async function criarTreino(treinoData) {
    if (!requireAuth()) return;
    
    try {
        const response = await authenticatedFetch('/api/treinos', {
            method: 'POST',
            body: JSON.stringify(treinoData)
        });
        
        const novoTreino = await response.json();
        adicionarTreinoNaLista(novoTreino);
        mostrarSucesso('Treino criado com sucesso!');
    } catch (error) {
        console.error('Erro ao criar treino:', error);
        mostrarErro('Não foi possível criar o treino');
    }
}

// Anotações
async function carregarAnotacoes() {
    if (!requireAuth()) return;
    
    try {
        const response = await authenticatedFetch('/api/anotacoes');
        const anotacoes = await response.json();
        renderizarAnotacoes(anotacoes);
    } catch (error) {
        console.error('Erro ao carregar anotações:', error);
    }
}

async function criarAnotacao(anotacaoData) {
    if (!requireAuth()) return;
    
    try {
        const response = await authenticatedFetch('/api/anotacoes', {
            method: 'POST',
            body: JSON.stringify(anotacaoData)
        });
        
        const novaAnotacao = await response.json();
        adicionarAnotacaoNaLista(novaAnotacao);
        mostrarSucesso('Anotação criada com sucesso!');
    } catch (error) {
        console.error('Erro ao criar anotação:', error);
        mostrarErro('Não foi possível criar a anotação');
    }
}

// Funções de UI (exemplos)
function mostrarSucesso(mensagem) {
    // Implementar notificação de sucesso
    console.log('✅', mensagem);
}

function mostrarErro(mensagem) {
    // Implementar notificação de erro
    console.error('❌', mensagem);
}

// Funções de renderização (exemplos)
function renderizarAlunos(alunos) {
    console.log('Alunos carregados:', alunos);
}

function adicionarAlunoNaLista(aluno) {
    console.log('Aluno adicionado:', aluno);
}

function atualizarAlunoNaLista(id, aluno) {
    console.log('Aluno atualizado:', id, aluno);
}

function removerAlunoDaLista(id) {
    console.log('Aluno removido:', id);
}

// Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticação
    if (!requireAuth()) return;
    
    // Carregar dados iniciais
    carregarAlunos();
    carregarDietas();
    carregarTreinos();
    carregarAnotacoes();
    
    // Adicionar listener para logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            auth.logout();
        });
    }
    
    // Mostrar informações do usuário
    const userInfo = document.querySelector('.user-info');
    if (userInfo && auth.currentUser) {
        userInfo.textContent = auth.currentUser.email;
    }
});

// Sincronização em tempo real (opcional)
// Para implementar WebSocket ou polling para atualizações em tempo real
function setupRealtimeSync() {
    // Implementar WebSocket ou polling aqui
    console.log('Sincronização em tempo real configurada');
}
