#!/usr/bin/env node

/**
 * Teste rápido do erro 405
 */

const http = require('http');

console.log('\n🧪 TESTANDO ERRO 405 - Geração de Currículo\n');

const testData = JSON.stringify({
    nome: 'Teste Silva',
    cargo: 'Desenvolvedor',
    email: 'teste@email.com',
    telefone: '(11) 99999-9999',
    cidade: 'São Paulo',
    experiencia: 'Experiência em desenvolvimento',
    formacao: 'Graduação em Engenharia',
    habilidades: 'JavaScript, Node.js, React',
    template: 'simples'
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/generate-cv',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(testData)
    }
};

const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers: ${JSON.stringify(res.headers)}\n`);

    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        if (res.statusCode === 200) {
            console.log('✅ SUCESSO! Currículo gerado');
            try {
                const result = JSON.parse(data);
                console.log(`ID: ${result.id}`);
                console.log(`Template: ${result.template}`);
            } catch (e) {
                console.log('Resposta:', data.substring(0, 200));
            }
        } else if (res.statusCode === 405) {
            console.log('❌ ERRO 405: Method Not Allowed');
            console.log('Resposta:', data);
        } else {
            console.log('❌ ERRO:', res.statusCode);
            console.log('Resposta:', data);
        }
        process.exit(res.statusCode === 200 ? 0 : 1);
    });
});

req.on('error', (e) => {
    console.error(`❌ Erro na requisição: ${e.message}`);
    process.exit(1);
});

req.write(testData);
req.end();
