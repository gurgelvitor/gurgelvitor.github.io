// Script para verificar e corrigir estrutura das tabelas
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTableStructure() {
    console.log('🔍 Verificando estrutura das tabelas...');
    
    const tables = [
        'alunos', 'dietas', 'treinos', 'anotacoes', 
        'agenda', 'cargas', 'financeiro', 'pagamentos', 
        'calculos', 'treinos_novo', 'user_data'
    ];
    
    for (const tableName of tables) {
        try {
            console.log(`\n📋 Verificando tabela: ${tableName}`);
            
            // Tentar buscar dados para ver se a tabela existe
            const { data, error } = await supabase
                .from(tableName)
                .select('*')
                .limit(1);
            
            if (error) {
                console.log(`❌ Erro na tabela ${tableName}:`, error.message);
                continue;
            }
            
            if (data && data.length > 0) {
                const columns = Object.keys(data[0]);
                console.log(`✅ Colunas em ${tableName}:`, columns);
                
                // Verificar se tem user_id
                if (!columns.includes('user_id')) {
                    console.log(`⚠️  ATENÇÃO: Tabela ${tableName} não tem coluna user_id`);
                    
                    // Tentar adicionar coluna user_id
                    try {
                        const { error: alterError } = await supabase.rpc('add_user_id_column', { 
                            table_name: tableName 
                        });
                        
                        if (alterError) {
                            console.log(`❌ Erro ao adicionar user_id em ${tableName}:`, alterError.message);
                        } else {
                            console.log(`✅ Coluna user_id adicionada a ${tableName}`);
                        }
                    } catch (rpcError) {
                        console.log(`❌ Não foi possível adicionar user_id a ${tableName}:`, rpcError.message);
                    }
                } else {
                    console.log(`✅ Tabela ${tableName} já tem user_id`);
                }
            } else {
                console.log(`📝 Tabela ${tableName} está vazia, verificando estrutura...`);
                
                // Verificar estrutura da tabela vazia
                const { data: structure, error: structError } = await supabase
                    .from(tableName)
                    .select('*')
                    .limit(0);
                
                if (!structError) {
                    console.log(`✅ Tabela ${tableName} existe e está vazia`);
                }
            }
        } catch (err) {
            console.log(`❌ Erro ao verificar tabela ${tableName}:`, err.message);
        }
    }
}

async function createSampleData() {
    console.log('\n🔧 Criando dados de teste...');
    
    try {
        // Verificar se há usuários
        const { data: users, error: userError } = await supabase
            .from('pessoas')
            .select('id, email')
            .limit(1);
        
        if (userError) {
            console.log('❌ Erro ao buscar usuários:', userError.message);
            return;
        }
        
        if (!users || users.length === 0) {
            console.log('❌ Nenhum usuário encontrado. Crie uma conta primeiro.');
            return;
        }
        
        const userId = users[0].id;
        console.log(`👤 Usando usuário: ${users[0].email} (ID: ${userId})`);
        
        // Criar aluno de teste
        const { data: aluno, error: alunoError } = await supabase
            .from('alunos')
            .insert([{
                nome: 'Aluno Teste Sincronização',
                email: 'teste@exemplo.com',
                telefone: '11999999999',
                status: 'ativo',
                user_id: userId
            }])
            .select();
        
        if (alunoError) {
            console.log('❌ Erro ao criar aluno:', alunoError.message);
        } else {
            console.log('✅ Aluno de teste criado:', aluno[0]);
        }
        
        // Criar dieta de teste
        const { data: dieta, error: dietaError } = await supabase
            .from('dietas')
            .insert([{
                nome: 'Dieta Teste',
                descricao: 'Dieta para teste de sincronização',
                user_id: userId
            }])
            .select();
        
        if (dietaError) {
            console.log('❌ Erro ao criar dieta:', dietaError.message);
        } else {
            console.log('✅ Dieta de teste criada:', dieta[0]);
        }
        
        // Criar treino de teste
        const { data: treino, error: treinoError } = await supabase
            .from('treinos')
            .insert([{
                nome: 'Treino Teste',
                descricao: 'Treino para teste de sincronização',
                user_id: userId
            }])
            .select();
        
        if (treinoError) {
            console.log('❌ Erro ao criar treino:', treinoError.message);
        } else {
            console.log('✅ Treino de teste criado:', treino[0]);
        }
        
        // Criar anotação de teste
        const { data: anotacao, error: anotacaoError } = await supabase
            .from('anotacoes')
            .insert([{
                titulo: 'Anotação Teste',
                conteudo: 'Anotação para teste de sincronização',
                user_id: userId
            }])
            .select();
        
        if (anotacaoError) {
            console.log('❌ Erro ao criar anotação:', anotacaoError.message);
        } else {
            console.log('✅ Anotação de teste criada:', anotacao[0]);
        }
        
    } catch (error) {
        console.log('❌ Erro ao criar dados de teste:', error.message);
    }
}

async function testAPIs() {
    console.log('\n🧪 Testando APIs...');
    
    try {
        // Testar API de alunos
        const response = await fetch('http://localhost:3001/api/alunos', {
            headers: {
                'Authorization': 'Bearer fake-token-for-test'
            }
        });
        
        if (response.status === 401) {
            console.log('✅ API de alunos protegida (requer autenticação)');
        } else {
            console.log('⚠️  API de alunos pode não estar protegida corretamente');
        }
    } catch (error) {
        console.log('❌ Erro ao testar API:', error.message);
    }
}

// Executar verificações
async function main() {
    await checkTableStructure();
    await createSampleData();
    await testAPIs();
    console.log('\n🎯 Verificação concluída!');
}

main().catch(console.error);
