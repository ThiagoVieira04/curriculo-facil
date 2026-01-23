#!/usr/bin/env node

/**
 * Script de Teste - Validar Correções do Erro 500
 * 
 * Uso: node test-vercel-fix.js
 */

const http = require('http');
const app = require('./server');

const PORT = process.env.PORT || 3000;
let server;

// Cores para output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(path) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: PORT,
            path: path,
            method: 'GET',
            timeout: 5000
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve({
                        status: res.statusCode,
                        headers: res.headers,
                        body: data ? JSON.parse(data) : data
                    });
                } catch (e) {
                    resolve({
                        status: res.statusCode,
                        headers: res.headers,
                        body: data
                    });
                }
            });
        });

        req.on('error', reject);
        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });

        req.end();
    });
}

async function runTests() {
    log('\n🧪 INICIANDO TESTES DE VALIDAÇÃO\n', 'blue');

    // Iniciar servidor
    log('📍 Iniciando servidor na porta ' + PORT + '...', 'yellow');
    server = app.listen(PORT, async () => {
        log('✅ Servidor iniciado com sucesso\n', 'green');

        const tests = [
            {
                name: 'Health Check',
                path: '/api/health',
                expectedStatus: 200
            },
            {
                name: 'Status',
                path: '/api/status',
                expectedStatus: 200
            },
            {
                name: 'Debug Env',
                path: '/api/debug-env',
                expectedStatus: 200
            },
            {
                name: 'Página Sobre',
                path: '/sobre',
                expectedStatus: 200
            },
            {
                name: 'Página Contato',
                path: '/contato',
                expectedStatus: 200
            },
            {
                name: 'Página Dicas',
                path: '/dicas',
                expectedStatus: 200
            },
            {
                name: 'Página Privacidade',
                path: '/privacidade',
                expectedStatus: 200
            },
            {
                name: 'Página Termos',
                path: '/termos',
                expectedStatus: 200
            }
        ];

        let passed = 0;
        let failed = 0;

        for (const test of tests) {
            try {
                log(`\n🔍 Testando: ${test.name}`, 'blue');
                log(`   Path: ${test.path}`);

                const response = await makeRequest(test.path);

                if (response.status === test.expectedStatus) {
                    log(`   ✅ Status: ${response.status} (esperado: ${test.expectedStatus})`, 'green');
                    if (response.body && typeof response.body === 'object') {
                        log(`   📦 Response: ${JSON.stringify(response.body).substring(0, 100)}...`);
                    }
                    passed++;
                } else {
                    log(`   ❌ Status: ${response.status} (esperado: ${test.expectedStatus})`, 'red');
                    failed++;
                }
            } catch (error) {
                log(`   ❌ Erro: ${error.message}`, 'red');
                failed++;
            }
        }

        // Resumo
        log('\n' + '='.repeat(50), 'blue');
        log('📊 RESUMO DOS TESTES', 'blue');
        log('='.repeat(50), 'blue');
        log(`✅ Passou: ${passed}/${tests.length}`, 'green');
        log(`❌ Falhou: ${failed}/${tests.length}`, failed > 0 ? 'red' : 'green');
        log('='.repeat(50), 'blue');

        if (failed === 0) {
            log('\n🎉 TODOS OS TESTES PASSARAM!\n', 'green');
            log('Você pode fazer deploy com segurança.\n', 'green');
        } else {
            log('\n⚠️  ALGUNS TESTES FALHARAM!\n', 'red');
            log('Verifique os erros acima antes de fazer deploy.\n', 'red');
        }

        // Fechar servidor
        server.close(() => {
            log('🛑 Servidor encerrado\n', 'yellow');
            process.exit(failed > 0 ? 1 : 0);
        });
    });
}

// Executar testes
runTests().catch(error => {
    log(`\n❌ Erro ao executar testes: ${error.message}\n`, 'red');
    if (server) server.close();
    process.exit(1);
});
