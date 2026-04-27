// Sistema de Autenticação e Sincronização
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.token = null;
        this.init();
    }

    init() {
        // Verificar se há usuário salvo no localStorage
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            try {
                const userData = JSON.parse(savedUser);
                this.currentUser = userData;
                this.token = userData.token;
                this.updateUIForLoggedInUser();
            } catch (error) {
                console.error('Erro ao carregar dados do usuário:', error);
                this.logout();
            }
        }

        // Verificar sessão no servidor
        this.checkSession();
    }

    async login(email, password) {
        try {
            const response = await fetch('/api/pessoas/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro no login');
            }

            // Salvar dados do usuário
            this.currentUser = data;
            this.token = data.token;
            localStorage.setItem('currentUser', JSON.stringify(data));
            
            this.updateUIForLoggedInUser();
            return data;
        } catch (error) {
            console.error('Erro no login:', error);
            throw error;
        }
    }

    async logout() {
        try {
            await fetch('/api/logout', { method: 'POST' });
        } catch (error) {
            console.error('Erro no logout do servidor:', error);
        }
        
        this.currentUser = null;
        this.token = null;
        localStorage.removeItem('currentUser');
        this.updateUIForLoggedOutUser();
        
        // Redirecionar para login
        if (window.location.pathname !== '/login.html') {
            window.location.href = 'login.html';
        }
    }

    async checkSession() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return;
            }
            
            const response = await fetch('/api/check-session', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                this.currentUser = data.user;
                this.updateUIForLoggedInUser();
            }
        } catch (error) {
            // Sessão inválida, manter estado atual do localStorage
            console.log('Sessão inválida ou expirada');
        }
    }

    updateUIForLoggedInUser() {
        // Atualizar elementos UI que mostram status de login
        const loginElements = document.querySelectorAll('.login-required');
        const logoutElements = document.querySelectorAll('.logout-required');
        
        loginElements.forEach(el => el.style.display = 'none');
        logoutElements.forEach(el => el.style.display = 'block');

        // Mostrar informações do usuário
        const userInfoElements = document.querySelectorAll('.user-info');
        userInfoElements.forEach(el => {
            if (this.currentUser) {
                el.textContent = this.currentUser.email;
            }
        });
    }

    updateUIForLoggedOutUser() {
        // Atualizar elementos UI para estado deslogado
        const loginElements = document.querySelectorAll('.login-required');
        const logoutElements = document.querySelectorAll('.logout-required');
        
        loginElements.forEach(el => el.style.display = 'block');
        logoutElements.forEach(el => el.style.display = 'none');
    }

    // Verificar se usuário está autenticado
    isAuthenticated() {
        return this.currentUser && this.token;
    }

    // Obter headers para requisições autenticadas
    getAuthHeaders() {
        if (!this.token) {
            throw new Error('Usuário não autenticado');
        }
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        };
    }

    // Redirecionar se não estiver autenticado
    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }
}

// Criar instância global
const auth = new AuthManager();

// Funções auxiliares para requisições autenticadas
async function authenticatedFetch(url, options = {}) {
    if (!auth.isAuthenticated()) {
        throw new Error('Usuário não autenticado');
    }
    
    const headers = auth.getAuthHeaders();
    const response = await fetch(url, {
        ...options,
        headers: {
            ...headers,
            ...options.headers
        }
    });
    
    if (response.status === 401 || response.status === 403) {
        auth.logout();
        throw new Error('Sessão expirada. Faça login novamente.');
    }
    
    return response;
}

// Exportar para uso em outros arquivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { auth, authenticatedFetch };
} else {
    window.auth = auth;
    window.authenticatedFetch = authenticatedFetch;
}
