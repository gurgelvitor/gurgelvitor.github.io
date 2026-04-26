const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração Supabase
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('🔧 Configuração do Supabase:');
console.log('📡 URL:', process.env.SUPABASE_URL ? '✅ Configurada' : '❌ Não configurada');
console.log('🔑 Anon Key:', process.env.SUPABASE_ANON_KEY ? '✅ Configurada' : '❌ Não configurada');
console.log('🛡️ Service Role:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Configurada' : '❌ Não configurada');

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Rotas para Pessoas
app.get('/api/pessoas', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('pessoas')
            .select('id, email, created_at')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/pessoas', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Hash da senha
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const { data, error } = await supabase
            .from('pessoas')
            .insert([{ email, password: hashedPassword }])
            .select('id, email, created_at');
        
        if (error) throw error;
        res.json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/pessoas/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        console.log('🔍 Login attempt:', { email, password: '***' });
        
        // Buscar pessoa pelo email
        const { data, error } = await supabase
            .from('pessoas')
            .select('*')
            .eq('email', email);
        
        console.log('👤 Query result:', { data: !!data, error: !!error, dataLength: data?.length || 0 });
        
        if (error) {
            console.log('❌ Database error:', error.message);
            return res.status(401).json({ error: 'Email ou senha inválidos' });
        }
        
        if (!data || data.length === 0) {
            console.log('❌ User not found: No data returned');
            return res.status(401).json({ error: 'Email ou senha inválidos' });
        }
        
        const user = data[0];
        console.log('👤 User found:', !!user);
        if (user) {
            console.log('📧 Email:', user.email);
            console.log('🔑 Password hash exists:', !!user.password);
        }
        
        // Verificar senha
        console.log('🔐 Comparing password...');
        const validPassword = await bcrypt.compare(password, user.password);
        console.log('🔐 Password valid:', validPassword);
        
        if (!validPassword) {
            console.log('❌ Invalid password');
            return res.status(401).json({ error: 'Email ou senha inválidos' });
        }
        
        // Retornar dados sem a senha
        const { password: _, ...pessoaData } = user;
        console.log('✅ Login successful for:', pessoaData.email);
        res.json(pessoaData);
    } catch (error) {
        console.error('❌ Login error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/pessoas/:id', async (req, res) => {
    try {
        const { error } = await supabase
            .from('pessoas')
            .delete()
            .eq('id', req.params.id);
        
        if (error) throw error;
        res.json({ message: 'Pessoa excluída com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/alunos.html');
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📊 Supabase URL: ${process.env.SUPABASE_URL}`);
});
