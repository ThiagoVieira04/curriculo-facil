const http = require('http');
const app = require('./server'); // Importa a aplicação principal

// 1. Iniciar o servidor em uma porta aleatória para testes
const server = app.listen(0, '127.0.0.1', () => {
    const port = server.address().port;
    console.log(`[TESTE] Servidor de teste iniciado na porta ${port}`);

    // 2. Definir as opções da requisição de teste
    const options = {
        hostname: '127.0.0.1',
        port: port,
        path: '/contato',
        method: 'GET'
    };

    // 3. Fazer a requisição HTTP para a rota /contato
    const req = http.request(options, (res) => {
        console.log(`[TESTE] Rota /contato respondeu com status: ${res.statusCode}`);

        // 4. Verificar o resultado
        if (res.statusCode === 200) {
            console.log('✅ SUCESSO: A rota /contato está funcionando e retornou o HTML.');
        } else {
            console.error(`❌ FALHA: A rota /contato retornou um erro inesperado: ${res.statusCode}`);
            process.exitCode = 1; // Indica falha no teste
        }

        // Consumir o corpo da resposta para liberar memória
        res.on('data', () => {});
        res.on('end', () => {
            // 5. Encerrar o servidor após o teste
            server.close(() => {
                console.log('[TESTE] Servidor de teste encerrado.');
            });
        });
    });

    // Lidar com erros na requisição
    req.on('error', (e) => {
        console.error(`❌ FALHA: Erro ao tentar fazer a requisição para /contato: ${e.message}`);
        process.exitCode = 1; // Indica falha no teste
        server.close(() => {
            console.log('[TESTE] Servidor de teste encerrado após erro.');
        });
    });

    req.end();
});

// Lidar com erros na inicialização do servidor
server.on('error', (e) => {
    console.error(`❌ FALHA: Não foi possível iniciar o servidor de teste: ${e.message}`);
    process.exit(1);
});
