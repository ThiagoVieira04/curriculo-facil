#!/usr/bin/env node

// Script de inicialização com verificações e correções
console.log('🚀 Iniciando CurrículoFácil...\n');

const fs = require('fs');
const path = require('path');

// Função para verificar se um arquivo existe
function fileExists(filePath) {
    try {
        return fs.existsSync(filePath);
    } catch (error) {
        return false;
    }
}

// Função para verificar dependências
function checkDependencies() {
    console.log('📦 Verificando dependências...');

    const dependencies = [
        'express',
        'multer',
        'sharp',
        'puppeteer',
        'cors',
        'helmet'
    ];

    const missing = [];

    dependencies.forEach(dep => {
        try {
            require(dep);
        } catch (error) {
            missing.push(dep);
        }
    });

    if (missing.length > 0) {
        console.log('❌ Dependências faltando:', missing.join(', '));
        console.log('💡 Execute: npm install');
        return false;
    }

    console.log('✅ Todas as dependências estão instaladas');
    return true;
}

// Função para verificar arquivos necessários
function checkFiles() {
    console.log('📁 Verificando arquivos...');

    const requiredFiles = [
        'server.js',
        'config.js',
        'utils.js',
        'public/index.html',
        'public/js/main.js',
        'public/css/style.css'
    ];

    const missing = requiredFiles.filter(file => !fileExists(file));

    if (missing.length > 0) {
        console.log('❌ Arquivos faltando:', missing.join(', '));
        return false;
    }

    console.log('✅ Todos os arquivos necessários estão presentes');
    return true;
}

// Função para verificar portas
function checkPort(port) {
    return new Promise((resolve) => {
        const net = require('net');
        const server = net.createServer();

        server.listen(port, () => {
            server.once('close', () => {
                resolve(true);
            });
            server.close();
        });

        server.on('error', () => {
            resolve(false);
        });
    });
}

// Função principal
async function main() {
    try {
        // 1. Verificar dependências
        if (!checkDependencies()) {
            process.exit(1);
        }

        // 2. Verificar arquivos
        if (!checkFiles()) {
            console.log('💡 Alguns arquivos estão faltando. Verifique a estrutura do projeto.');
            process.exit(1);
        }

        // 3. Verificar porta
        const PORT = process.env.PORT || 3000;
        console.log(`🔌 Verificando porta ${PORT}...`);

        const portAvailable = await checkPort(PORT);
        if (!portAvailable) {
            console.log(`⚠️  Porta ${PORT} já está em uso`);
            console.log('💡 Tente uma porta diferente ou pare o processo que está usando esta porta');
        } else {
            console.log(`✅ Porta ${PORT} disponível`);
        }

        // 4. Verificar variáveis de ambiente
        console.log('🔧 Verificando configurações...');

        if (!process.env.NODE_ENV) {
            process.env.NODE_ENV = 'development';
            console.log('💡 NODE_ENV definido como development');
        }

        console.log(`✅ Ambiente: ${process.env.NODE_ENV}`);

        // 5. Criar diretórios necessários
        console.log('📂 Verificando diretórios...');

        const dirs = ['uploads', 'generated', 'templates'];
        dirs.forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
                console.log(`✅ Diretório criado: ${dir}`);
            }
        });

        // 6. Iniciar servidor
        console.log('\\n🎯 Iniciando servidor principal...\\n');

        // Importar e iniciar o servidor principal
        const serverApp = require('./server.js');
        if (typeof serverApp.startServer === 'function') {
            serverApp.startServer();
        } else {
            console.warn('⚠️ Função startServer não encontrada em server.js. Verifique se o servidor iniciou.');
        }

    } catch (error) {
        console.error('❌ Erro durante a inicialização:', error.message);
        console.error('Stack:', error.stack);
        process.exit(1);
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    main();
}

module.exports = { checkDependencies, checkFiles, checkPort };