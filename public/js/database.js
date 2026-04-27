// Configuração Supabase para uso no frontend
const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Funções para gerenciar pessoas
const pessoasAPI = {
    // Listar todas as pessoas (sem senhas)
    async listar() {
        const { data, error } = await supabase
            .from('pessoas')
            .select('id, email, created_at')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data;
    },

    // Criar nova pessoa
    async criar(email, password) {
        // No frontend, a senha será hasheada no backend
        const { data, error } = await supabase
            .from('pessoas')
            .insert([{ email, password }])
            .select('id, email, created_at');
        
        if (error) throw error;
        return data[0];
    },

    // Login de pessoa
    async login(email, password) {
        const response = await fetch('/api/pessoas/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erro no login');
        }
        
        return response.json();
    },

    // Excluir pessoa
    async excluir(id) {
        const { error } = await supabase
            .from('pessoas')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        return true;
    },

    // Buscar pessoa por ID (sem senha)
    async buscarPorId(id) {
        const { data, error } = await supabase
            .from('pessoas')
            .select('id, email, created_at')
            .eq('id', id)
            .single();
        
        if (error) throw error;
        return data;
    }
};

module.exports = { supabase, pessoasAPI };
