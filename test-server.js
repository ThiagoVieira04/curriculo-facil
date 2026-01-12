// Teste simples do servidor
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware básico
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Rota de teste
app.get('/test', (req, res) => {
    res.json({ message: 'Servidor funcionando!', timestamp: new Date().toISOString() });
});

// Rota de teste para API
app.post('/api/test', (req, res) => {
    console.log('Teste POST recebido:', req.body);
    res.json({ 
        message: 'POST funcionando!', 
        received: req.body,
        timestamp: new Date().toISOString() 
    });
});

// Servir index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`✅ Servidor de teste rodando na porta ${PORT}`);
    console.log(`🌐 Acesse: http://localhost:${PORT}`);
    console.log(`🧪 Teste: http://localhost:${PORT}/test`);
});