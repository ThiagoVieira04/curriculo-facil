// Entry point para Vercel Serverless
// Otimizado para evitar crashes

const express = require('express');
const path = require('path');
const fs = require('fs');

// Criar app Express simples
const app = express();

// Middleware básico
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.set('trust proxy', true);

// Caminho para arquivos públicos
const publicPath = path.join(__dirname, '..', 'public');

// Servir arquivos estáticos
app.use(express.static(publicPath));

// Health check simples
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Rotas específicas
app.get('/', (req, res) => {
    const filePath = path.join(publicPath, 'index.html');
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send('404 - Página não encontrada');
    }
});

app.get('/sobre', (req, res) => {
    const filePath = path.join(publicPath, 'sobre.html');
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.sendFile(path.join(publicPath, 'index.html'));
    }
});

app.get('/contato', (req, res) => {
    const filePath = path.join(publicPath, 'contato.html');
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.sendFile(path.join(publicPath, 'index.html'));
    }
});

// Catch-all para SPA - redireciona para home
app.use((req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

// Exportar para Vercel
module.exports = app;
