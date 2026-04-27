const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const session = require('express-session');
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

// Configuração de sessão
app.use(session({
    secret: process.env.JWT_SECRET || 'gurgeltrack-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 horas
}));

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }
    
    jwt.verify(token, process.env.JWT_SECRET || 'gurgeltrack-secret', (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido' });
        }
        req.user = user;
        next();
    });
};

// Middleware para verificar sessão
const checkSession = (req, res, next) => {
    if (req.session && req.session.user) {
        req.user = req.session.user;
        next();
    } else {
        return res.status(401).json({ error: 'Usuário não autenticado' });
    }
};

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
        
        // Criar token JWT
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'gurgeltrack-secret', { expiresIn: '24h' });
        
        // Salvar sessão
        req.session.user = { id: user.id, email: user.email };
        
        res.json({ ...pessoaData, token });
    } catch (error) {
        console.error('❌ Login error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Rota de logout
app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao fazer logout' });
        }
        res.json({ message: 'Logout realizado com sucesso' });
    });
});

// Rota para verificar sessão
app.get('/api/check-session', checkSession, (req, res) => {
    res.json({ user: req.user });
});

// Rotas para ALUNOS (com sincronização por usuário)
app.get('/api/alunos', authenticateToken, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('alunos')
            .select('*')
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/alunos', authenticateToken, async (req, res) => {
    try {
        const alunoData = { ...req.body, user_id: req.user.id };
        const { data, error } = await supabase
            .from('alunos')
            .insert([alunoData])
            .select();
        
        if (error) throw error;
        res.json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/alunos/:id', authenticateToken, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('alunos')
            .update(req.body)
            .eq('id', req.params.id)
            .eq('user_id', req.user.id)
            .select();
        
        if (error) throw error;
        if (data.length === 0) {
            return res.status(404).json({ error: 'Aluno não encontrado' });
        }
        res.json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/alunos/:id', authenticateToken, async (req, res) => {
    try {
        const { error } = await supabase
            .from('alunos')
            .delete()
            .eq('id', req.params.id)
            .eq('user_id', req.user.id);
        
        if (error) throw error;
        res.json({ message: 'Aluno excluído com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rotas para DIETAS (com sincronização por usuário)
app.get('/api/dietas', authenticateToken, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('dietas')
            .select('*')
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/dietas', authenticateToken, async (req, res) => {
    try {
        const dietaData = { ...req.body, user_id: req.user.id };
        const { data, error } = await supabase
            .from('dietas')
            .insert([dietaData])
            .select();
        
        if (error) throw error;
        res.json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/dietas/:id', authenticateToken, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('dietas')
            .update(req.body)
            .eq('id', req.params.id)
            .eq('user_id', req.user.id)
            .select();
        
        if (error) throw error;
        if (data.length === 0) {
            return res.status(404).json({ error: 'Dieta não encontrada' });
        }
        res.json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/dietas/:id', authenticateToken, async (req, res) => {
    try {
        const { error } = await supabase
            .from('dietas')
            .delete()
            .eq('id', req.params.id)
            .eq('user_id', req.user.id);
        
        if (error) throw error;
        res.json({ message: 'Dieta excluída com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rotas para TREINOS (com sincronização por usuário)
app.get('/api/treinos', authenticateToken, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('treinos')
            .select('*')
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/treinos', authenticateToken, async (req, res) => {
    try {
        const treinoData = { ...req.body, user_id: req.user.id };
        const { data, error } = await supabase
            .from('treinos')
            .insert([treinoData])
            .select();
        
        if (error) throw error;
        res.json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/treinos/:id', authenticateToken, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('treinos')
            .update(req.body)
            .eq('id', req.params.id)
            .eq('user_id', req.user.id)
            .select();
        
        if (error) throw error;
        if (data.length === 0) {
            return res.status(404).json({ error: 'Treino não encontrado' });
        }
        res.json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/treinos/:id', authenticateToken, async (req, res) => {
    try {
        const { error } = await supabase
            .from('treinos')
            .delete()
            .eq('id', req.params.id)
            .eq('user_id', req.user.id);
        
        if (error) throw error;
        res.json({ message: 'Treino excluído com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rotas para ANOTAÇÕES (com sincronização por usuário)
app.get('/api/anotacoes', authenticateToken, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('anotacoes')
            .select('*')
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/anotacoes', authenticateToken, async (req, res) => {
    try {
        const anotacaoData = { ...req.body, user_id: req.user.id };
        const { data, error } = await supabase
            .from('anotacoes')
            .insert([anotacaoData])
            .select();
        
        if (error) throw error;
        res.json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/anotacoes/:id', authenticateToken, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('anotacoes')
            .update(req.body)
            .eq('id', req.params.id)
            .eq('user_id', req.user.id)
            .select();
        
        if (error) throw error;
        if (data.length === 0) {
            return res.status(404).json({ error: 'Anotação não encontrada' });
        }
        res.json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/anotacoes/:id', authenticateToken, async (req, res) => {
    try {
        const { error } = await supabase
            .from('anotacoes')
            .delete()
            .eq('id', req.params.id)
            .eq('user_id', req.user.id);
        
        if (error) throw error;
        res.json({ message: 'Anotação excluída com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rotas para CARGAS (usando tabela anotacoes com categoria 'carga')
app.get('/api/cargas', authenticateToken, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('anotacoes')
            .select('*')
            .eq('user_id', req.user.id)
            .eq('categoria', 'carga')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/cargas', authenticateToken, async (req, res) => {
    try {
        const cargaData = { ...req.body, user_id: req.user.id, categoria: 'carga' };
        const { data, error } = await supabase
            .from('anotacoes')
            .insert([cargaData])
            .select();
        
        if (error) throw error;
        res.json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/cargas/:id', authenticateToken, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('anotacoes')
            .update(req.body)
            .eq('id', req.params.id)
            .eq('user_id', req.user.id)
            .eq('categoria', 'carga')
            .select();
        
        if (error) throw error;
        if (data.length === 0) {
            return res.status(404).json({ error: 'Carga não encontrada' });
        }
        res.json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/cargas/:id', authenticateToken, async (req, res) => {
    try {
        const { error } = await supabase
            .from('anotacoes')
            .delete()
            .eq('id', req.params.id)
            .eq('user_id', req.user.id)
            .eq('categoria', 'carga');
        
        if (error) throw error;
        res.json({ message: 'Carga excluída com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rotas para ACOMPANHAMENTO DE PESO
app.get('/api/pesos', authenticateToken, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('anotacoes')
            .select('*')
            .eq('user_id', req.user.id)
            .eq('categoria', 'peso')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Extrair dados do conteúdo JSON
        const pesos = data.map(anotacao => {
            let conteudoData = {};
            try {
                conteudoData = JSON.parse(anotacao.conteudo || '{}');
            } catch (e) {
                console.error('Erro ao parsear conteúdo:', e);
            }
            
            return {
                id: anotacao.id,
                date: conteudoData.date || anotacao.created_at?.split('T')[0],
                weight: conteudoData.weight,
                kcal: conteudoData.kcal,
                created_at: anotacao.created_at
            };
        });
        
        res.json(pesos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/pesos', authenticateToken, async (req, res) => {
    try {
        const { date, weight, kcal } = req.body;
        
        if (!date || !weight) {
            return res.status(400).json({ error: 'Data e peso são obrigatórios' });
        }
        
        const pesoData = {
            titulo: `Registro de Peso - ${date}`,
            conteudo: JSON.stringify({
                date: date,
                weight: weight,
                kcal: kcal || 0
            }),
            categoria: 'peso',
            user_id: req.user.id
        };
        
        const { data, error } = await supabase
            .from('anotacoes')
            .insert([pesoData])
            .select();
        
        if (error) throw error;
        res.json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/pesos/:id', authenticateToken, async (req, res) => {
    try {
        const { date, weight, kcal } = req.body;
        const { id } = req.params;
        
        // Verificar se o registro pertence ao usuário
        const { data: existing, error: checkError } = await supabase
            .from('anotacoes')
            .select('*')
            .eq('id', id)
            .eq('user_id', req.user.id)
            .eq('categoria', 'peso')
            .single();
        
        if (checkError || !existing) {
            return res.status(404).json({ error: 'Registro de peso não encontrado' });
        }
        
        const pesoData = {
            titulo: `Registro de Peso - ${date}`,
            conteudo: JSON.stringify({
                date: date,
                weight: weight,
                kcal: kcal || 0
            })
        };
        
        const { data, error } = await supabase
            .from('anotacoes')
            .update(pesoData)
            .eq('id', id)
            .select();
        
        if (error) throw error;
        res.json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/pesos/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        
        // Verificar se o registro pertence ao usuário
        const { data: existing, error: checkError } = await supabase
            .from('anotacoes')
            .select('*')
            .eq('id', id)
            .eq('user_id', req.user.id)
            .eq('categoria', 'peso')
            .single();
        
        if (checkError || !existing) {
            return res.status(404).json({ error: 'Registro de peso não encontrado' });
        }
        
        const { error } = await supabase
            .from('anotacoes')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        res.json({ message: 'Registro de peso excluído com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rotas para PAGAMENTOS
app.get('/api/pagamentos', authenticateToken, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('anotacoes')
            .select('*')
            .eq('user_id', req.user.id)
            .eq('categoria', 'pagamento')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Extrair dados do conteúdo JSON
        const pagamentos = data.map(anotacao => {
            let conteudoData = {};
            try {
                conteudoData = JSON.parse(anotacao.conteudo || '{}');
            } catch (e) {
                console.error('Erro ao parsear conteúdo:', e);
            }
            
            return {
                id: anotacao.id,
                ...conteudoData,
                created_at: anotacao.created_at
            };
        });
        
        res.json(pagamentos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/pagamentos', authenticateToken, async (req, res) => {
    try {
        const { alunoId, alunoNome, mes, ano, valor, status, metodo, dataPagamento, dataRegistro } = req.body;
        
        if (!alunoId || !alunoNome || !mes || !ano || !valor) {
            return res.status(400).json({ error: 'Campos obrigatórios: alunoId, alunoNome, mes, ano, valor' });
        }
        
        const pagamentoData = {
            titulo: `Pagamento - ${alunoNome} - ${mes}/${ano}`,
            conteudo: JSON.stringify({
                alunoId,
                alunoNome,
                mes,
                ano,
                valor,
                status: status || 'pendente',
                metodo: metodo || '',
                dataPagamento: dataPagamento || '',
                dataRegistro: dataRegistro || new Date().toISOString()
            }),
            categoria: 'pagamento',
            user_id: req.user.id
        };
        
        const { data, error } = await supabase
            .from('anotacoes')
            .insert([pagamentoData])
            .select();
        
        if (error) throw error;
        res.json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/pagamentos/:id', authenticateToken, async (req, res) => {
    try {
        const { alunoId, alunoNome, mes, ano, valor, status, metodo, dataPagamento, dataRegistro } = req.body;
        const { id } = req.params;
        
        // Verificar se o pagamento pertence ao usuário
        const { data: existing, error: checkError } = await supabase
            .from('anotacoes')
            .select('*')
            .eq('id', id)
            .eq('user_id', req.user.id)
            .eq('categoria', 'pagamento')
            .single();
        
        if (checkError || !existing) {
            return res.status(404).json({ error: 'Pagamento não encontrado' });
        }
        
        // Obter dados existentes
        let existingData = {};
        try {
            existingData = JSON.parse(existing.conteudo || '{}');
        } catch (e) {
            console.error('Erro ao parsear conteúdo existente:', e);
        }
        
        // Mesclar com novos dados
        const updatedData = {
            ...existingData,
            alunoId: alunoId || existingData.alunoId,
            alunoNome: alunoNome || existingData.alunoNome,
            mes: mes || existingData.mes,
            ano: ano || existingData.ano,
            valor: valor || existingData.valor,
            status: status !== undefined ? status : existingData.status,
            metodo: metodo !== undefined ? metodo : existingData.metodo,
            dataPagamento: dataPagamento || existingData.dataPagamento
        };
        
        const pagamentoData = {
            titulo: `Pagamento - ${updatedData.alunoNome} - ${updatedData.mes}/${updatedData.ano}`,
            conteudo: JSON.stringify(updatedData)
        };
        
        const { data, error } = await supabase
            .from('anotacoes')
            .update(pagamentoData)
            .eq('id', id)
            .select();
        
        if (error) throw error;
        res.json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/pagamentos/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        
        // Verificar se o pagamento pertence ao usuário
        const { data: existing, error: checkError } = await supabase
            .from('anotacoes')
            .select('*')
            .eq('id', id)
            .eq('user_id', req.user.id)
            .eq('categoria', 'pagamento')
            .single();
        
        if (checkError || !existing) {
            return res.status(404).json({ error: 'Pagamento não encontrado' });
        }
        
        const { error } = await supabase
            .from('anotacoes')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        res.json({ message: 'Pagamento excluído com sucesso' });
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
