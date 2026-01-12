// Correções específicas para "Failed to fetch"
console.log('🔧 Aplicando correções para "Failed to fetch"...\n');

// 1. Verificar se o servidor está rodando na porta correta
console.log('1. Verificando configuração de porta...');
const config = require('./config.js');
console.log(`✅ Porta configurada: ${config.PORT}`);

// 2. Criar versão simplificada do servidor para teste
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// CORS mais permissivo para desenvolvimento
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: false
}));

// Middleware básico
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Log de todas as requisições
app.use((req, res, next) => {
    console.log(`📝 ${new Date().toISOString()} - ${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('Body keys:', Object.keys(req.body));
    }
    next();
});

// Rota de teste simples
app.get('/api/test', (req, res) => {
    console.log('✅ Rota /api/test chamada');
    res.json({ 
        message: 'API funcionando!', 
        timestamp: new Date().toISOString(),
        method: 'GET'
    });
});

// Rota de teste POST
app.post('/api/test', (req, res) => {
    console.log('✅ Rota POST /api/test chamada');
    console.log('Dados recebidos:', req.body);
    res.json({ 
        message: 'POST funcionando!', 
        received: req.body,
        timestamp: new Date().toISOString(),
        method: 'POST'
    });
});

// Rota simplificada para gerar currículo
app.post('/api/generate-cv', (req, res) => {
    console.log('✅ Rota /api/generate-cv chamada');
    console.log('Campos recebidos:', Object.keys(req.body));
    
    // Validação básica
    const { nome, cargo, email } = req.body;
    
    if (!nome || !cargo || !email) {
        console.log('❌ Campos obrigatórios faltando');
        return res.status(400).json({ 
            error: 'Campos obrigatórios: nome, cargo, email' 
        });
    }
    
    // Simular geração de currículo
    const cvId = Date.now().toString();
    const html = `<div><h1>${nome}</h1><h2>${cargo}</h2><p>${email}</p></div>`;
    
    console.log('✅ Currículo simulado gerado:', cvId);
    
    res.json({
        id: cvId,
        html: html,
        message: 'Currículo gerado com sucesso (modo teste)!',
        nome: nome
    });
});

// Rota para download PDF (simulada)
app.post('/api/download-pdf/:id?', (req, res) => {
    console.log('✅ Rota /api/download-pdf chamada');
    console.log('ID:', req.params.id);
    console.log('Body:', req.body);
    
    // Simular erro de PDF para teste
    res.status(500).json({
        error: 'PDF desabilitado no modo teste',
        tip: 'Use o servidor principal para gerar PDFs'
    });
});

// Página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Middleware de erro
app.use((error, req, res, next) => {
    console.error('❌ Erro capturado:', error.message);
    console.error('Stack:', error.stack);
    
    res.status(500).json({ 
        error: 'Erro interno do servidor',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
});

// Iniciar servidor
const PORT = 3002; // Porta diferente para não conflitar
const server = app.listen(PORT, () => {
    console.log(`\n🚀 Servidor de correção rodando na porta ${PORT}`);
    console.log(`🌐 Acesse: http://localhost:${PORT}`);
    console.log(`🧪 Teste: http://localhost:${PORT}/api/test`);
    console.log('\n📋 Testes para executar no navegador:');
    console.log('1. Abra http://localhost:3002');
    console.log('2. Abra o console (F12)');
    console.log('3. Execute:');
    console.log('   fetch("/api/test").then(r => r.json()).then(console.log)');
    console.log('4. Execute:');
    console.log('   fetch("/api/test", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({test: "dados"})}).then(r => r.json()).then(console.log)');
    console.log('\n⚠️  Para parar: Ctrl+C');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\\n🛑 Encerrando servidor...');
    server.close(() => {
        console.log('✅ Servidor encerrado');
        process.exit(0);
    });
});