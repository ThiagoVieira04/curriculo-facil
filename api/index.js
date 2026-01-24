// Entry point para Vercel Serverless
// Otimizado para evitar crashes por tamanho de função

const express = require('express');
const path = require('path');

// Criar app Express simples
const app = express();

// Middleware básico
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.set('trust proxy', true);

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Health check simples
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Rota padrão - servir home
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Catch-all para SPA - redireciona para home
app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Tratamento de erro global
app.use((err, req, res, next) => {
    console.error('Erro:', err);
    res.status(500).json({ 
        error: 'Internal Server Error',
        message: err.message 
    });
});

// Exportar para Vercel
module.exports = app;
