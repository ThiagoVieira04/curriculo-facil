// Script de diagnóstico e correção
const express = require('express');
const path = require('path');
const fs = require('fs');

console.log('🔍 Iniciando diagnóstico do servidor...\n');

// 1. Verificar se todas as dependências estão instaladas
console.log('1. Verificando dependências...');
try {
    require('express');
    require('multer');
    require('sharp');
    require('puppeteer');
    require('cors');
    require('helmet');
    console.log('✅ Todas as dependências principais estão instaladas\n');
} catch (error) {
    console.log('❌ Erro nas dependências:', error.message);
    console.log('Execute: npm install\n');
    process.exit(1);
}

// 2. Verificar se os arquivos necessários existem
console.log('2. Verificando arquivos necessários...');
const requiredFiles = [
    'server.js',
    'config.js',
    'utils.js',
    'public/index.html',
    'public/js/main.js',
    'public/css/style.css'
];

let missingFiles = [];
requiredFiles.forEach(file => {
    if (!fs.existsSync(file)) {
        missingFiles.push(file);
    }
});

if (missingFiles.length > 0) {
    console.log('❌ Arquivos faltando:', missingFiles);
} else {
    console.log('✅ Todos os arquivos necessários estão presentes\n');
}

// 3. Testar servidor básico
console.log('3. Testando servidor básico...');
const app = express();

// Middleware básico
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static('public'));

// Middleware de log
app.use((req, res, next) => {
    console.log(`📝 ${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Rota de teste
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        message: 'Servidor funcionando corretamente'
    });
});

// Rota de teste POST
app.post('/api/test-post', (req, res) => {
    console.log('📨 Dados recebidos:', req.body);
    res.json({ 
        status: 'OK', 
        received: req.body,
        timestamp: new Date().toISOString()
    });
});

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Middleware de erro
app.use((error, req, res, next) => {
    console.error('❌ Erro capturado:', error.message);
    res.status(500).json({ 
        error: 'Erro interno do servidor',
        message: error.message
    });
});

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
    console.log(`✅ Servidor de diagnóstico rodando na porta ${PORT}`);
    console.log(`🌐 Acesse: http://localhost:${PORT}`);
    console.log(`🧪 Teste de saúde: http://localhost:${PORT}/api/health`);
    console.log('\n📋 Instruções:');
    console.log('1. Abra o navegador em http://localhost:3001');
    console.log('2. Abra o console do navegador (F12)');
    console.log('3. Execute: fetch("/api/health").then(r => r.json()).then(console.log)');
    console.log('4. Se funcionar, o problema não é de conectividade básica');
    console.log('\n⚠️  Para parar o servidor: Ctrl+C');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Encerrando servidor de diagnóstico...');
    server.close(() => {
        console.log('✅ Servidor encerrado');
        process.exit(0);
    });
});

// Teste automático após 2 segundos
setTimeout(async () => {
    console.log('\n🤖 Executando teste automático...');
    
    try {
        const response = await fetch(`http://localhost:${PORT}/api/health`);
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Teste automático passou:', data.message);
        } else {
            console.log('❌ Teste automático falhou:', response.status);
        }
    } catch (error) {
        console.log('❌ Erro no teste automático:', error.message);
        console.log('💡 Isso é normal se você não tiver fetch disponível no Node.js');
    }
}, 2000);