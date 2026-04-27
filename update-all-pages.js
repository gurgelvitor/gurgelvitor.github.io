// Script para atualizar todas as páginas com sistema de autenticação
const fs = require('fs');
const path = require('path');

const pages = [
    'alunos.html',
    'dieta.html', 
    'treino.html',
    'agenda.html',
    'carga.html',
    'calculo.html',
    'pagamentos.html',
    'index.html'
];

function updatePage(pageName) {
    const filePath = path.join(__dirname, pageName);
    
    if (!fs.existsSync(filePath)) {
        console.log(`❌ Arquivo não encontrado: ${pageName}`);
        return false;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Adicionar auth.js se não existir
    if (!content.includes('js/auth.js')) {
        content = content.replace(
            '<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>',
            '<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>\n    <script src="js/auth.js"></script>'
        );
    }
    
    // Adicionar verificação de autenticação no DOMContentLoaded
    const authCheck = `
        // Verificar autenticação
        if (!auth.isAuthenticated()) {
            window.location.href = 'login.html';
            return;
        }
        updateUserInfo();`;
    
    if (content.includes('document.addEventListener(\'DOMContentLoaded\'')) {
        content = content.replace(
            /document\.addEventListener\('DOMContentLoaded', function\(\) \{/,
            `document.addEventListener('DOMContentLoaded', function() {\n            ${authCheck}`
        );
    }
    
    // Salvar arquivo atualizado
    fs.writeFileSync(filePath, content);
    console.log(`✅ Página atualizada: ${pageName}`);
    return true;
}

// Atualizar todas as páginas
console.log('🔄 Atualizando páginas com sistema de autenticação...');
let updatedCount = 0;

pages.forEach(page => {
    if (updatePage(page)) {
        updatedCount++;
    }
});

console.log(`\\n🎯 Concluído! ${updatedCount}/${pages.length} páginas atualizadas.`);
