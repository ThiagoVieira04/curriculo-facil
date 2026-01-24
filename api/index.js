// Entry point para Vercel Serverless
// Otimizado para produção com logging profissional

const express = require('express');
const path = require('path');
const fs = require('fs');

// Criar app Express
const app = express();

// ============================================
// 1. ENVIRONMENT CONFIGURATION
// ============================================
const NODE_ENV = process.env.NODE_ENV || 'production';
const isDev = NODE_ENV === 'development';

// ============================================
// 2. REQUEST LOGGING MIDDLEWARE
// ============================================
app.use((req, res, next) => {
    const requestId = `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const startTime = Date.now();
    
    res.locals.requestId = requestId;
    res.locals.startTime = startTime;
    
    console.log(`[${requestId}] → ${req.method} ${req.path}`);
    
    // Interceptar response para logging
    const originalSend = res.send;
    res.send = function(data) {
        const duration = Date.now() - startTime;
        const status = res.statusCode;
        const statusEmoji = status < 400 ? '✅' : status < 500 ? '⚠️' : '❌';
        console.log(`[${requestId}] ${statusEmoji} ${status} (${duration}ms)`);
        return originalSend.call(this, data);
    };
    
    next();
});

// ============================================
// 3. MIDDLEWARE BASIC
// ============================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.set('trust proxy', true);

// ============================================
// 4. PATH CONFIGURATION
// ============================================
const publicPath = path.join(__dirname, '..', 'public');

// Validar configuração ao iniciar
const healthCheck = () => {
    const checks = {
        PUBLIC_PATH_EXISTS: fs.existsSync(publicPath),
        PUBLIC_PATH: publicPath,
        INDEX_HTML: fs.existsSync(path.join(publicPath, 'index.html')),
        PLATFORM: process.platform,
        NODE_ENV: NODE_ENV
    };
    
    if (!checks.PUBLIC_PATH_EXISTS) {
        console.error('❌ ERRO: public/ não encontrado em:', publicPath);
    }
    if (!checks.INDEX_HTML) {
        console.error('❌ ERRO: index.html não encontrado em:', path.join(publicPath, 'index.html'));
    }
    
    return checks;
};

console.log('📋 Verificação de startup:', healthCheck());

// ============================================
// 5. STATIC FILES MIDDLEWARE
// ============================================
app.use(express.static(publicPath, {
    maxAge: '1d',
    etag: false,
    index: false  // Desabilitar para usar rotas customizadas
}));

// ============================================
// 6. HEALTH CHECK ENDPOINT
// ============================================
app.get('/api/health', (req, res) => {
    try {
        const health = {
            status: 'ok',
            timestamp: new Date().toISOString(),
            environment: NODE_ENV,
            platform: process.platform,
            nodeVersion: process.version,
            publicPathExists: fs.existsSync(publicPath)
        };
        
        // Em produção, não expor detalhes sensíveis
        if (!isDev) {
            delete health.nodeVersion;
        }
        
        res.json(health);
    } catch (error) {
        console.error('[/api/health] Erro:', error.message);
        res.status(500).json({ error: 'Health check failed' });
    }
});

// ============================================
// 7. SERVE FILE FUNCTION (CORE)
// ============================================
function serveFile(res, filename, requestId = 'UNKNOWN') {
    try {
        // IMPORTANTE: Normalizar para lowercase (case-sensitive no Linux)
        const normalizedFilename = filename.toLowerCase();
        
        // SECURITY: Rejeitar paths perigosos
        if (normalizedFilename.includes('..') || normalizedFilename.startsWith('/')) {
            console.warn(`[${requestId}] 🚨 PATH TRAVERSAL ATTEMPT: ${filename}`);
            return res.status(403).json({ error: 'Access denied' });
        }
        
        const filePath = path.join(publicPath, normalizedFilename);
        
        // SECURITY: Validação contra path traversal (resolve-based check)
        const resolvedPath = path.resolve(filePath);
        const resolvedPublic = path.resolve(publicPath);
        
        if (!resolvedPath.startsWith(resolvedPublic)) {
            console.warn(`[${requestId}] 🚨 PATH TRAVERSAL DETECTED: ${filename} → ${resolvedPath}`);
            return res.status(403).json({ error: 'Access denied' });
        }
        
        // DEBUG: Log detalhado
        console.log(`[${requestId}] 📂 Serve: ${normalizedFilename} → ${resolvedPath}`);
        
        // Verificar se arquivo existe
        if (!fs.existsSync(filePath)) {
            console.warn(`[${requestId}] ⚠️ Arquivo não encontrado: ${normalizedFilename}`);
            
            // Fallback para index.html (SPA behavior)
            const indexPath = path.join(publicPath, 'index.html');
            if (fs.existsSync(indexPath)) {
                console.log(`[${requestId}] → Fallback para index.html`);
                return res.sendFile(indexPath, { maxAge: '1h' }, (err) => {
                    if (err && !res.headersSent) {
                        console.error(`[${requestId}] ❌ Erro ao enviar index.html:`, err.message);
                        res.status(500).json({ error: 'Failed to serve index' });
                    }
                });
            }
            
            // Nenhum fallback disponível
            return res.status(404).json({ 
                error: 'Not found',
                requested: filename,
                normalized: normalizedFilename
            });
        }
        
        // Enviar arquivo
        return res.sendFile(filePath, { maxAge: '1h' }, (err) => {
            if (err) {
                if (err.code === 'ERR_HTTP_HEADERS_SENT') {
                    console.log(`[${requestId}] ℹ️ Headers já enviados`);
                } else {
                    console.error(`[${requestId}] ❌ Erro ao enviar: ${err.code} - ${err.message}`);
                    if (!res.headersSent) {
                        res.status(500).json({ error: 'Failed to send file', code: err.code });
                    }
                }
            }
        });
    } catch (error) {
        console.error(`[${requestId}] 💥 ERRO CRÍTICO em serveFile(${filename}):`, error.message);
        console.error(error.stack);
        
        if (!res.headersSent) {
            res.status(500).json({ 
                error: 'Internal server error',
                message: isDev ? error.message : undefined
            });
        }
    }
}

// ============================================
// 8. ROTAS ESPECÍFICAS
// ============================================
app.get('/', (req, res) => {
    serveFile(res, 'index.html', res.locals.requestId);
});

app.get('/sobre', (req, res) => {
    serveFile(res, 'sobre.html', res.locals.requestId);
});

app.get('/contato', (req, res) => {
    serveFile(res, 'contato.html', res.locals.requestId);
});

app.get('/empresa', (req, res) => {
    serveFile(res, 'empresa.html', res.locals.requestId);
});

// ============================================
// 9. CATCH-ALL PARA SPA
// ============================================
app.use((req, res) => {
    console.log(`[${res.locals.requestId}] → Catch-all: ${req.method} ${req.path}`);
    serveFile(res, 'index.html', res.locals.requestId);
});

// ============================================
// 10. GLOBAL ERROR HANDLER (DEVE SER ÚLTIMO!)
// ============================================
app.use((err, req, res, next) => {
    const errorId = `ERR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const requestId = res.locals?.requestId || errorId;
    
    console.error(`\n${'='.repeat(60)}`);
    console.error(`[${errorId}] ERRO NÃO CAPTURADO`);
    console.error(`Request: ${req.method} ${req.path}`);
    console.error(`Message: ${err.message}`);
    console.error(`Stack:\n${err.stack}`);
    console.error(`${'='.repeat(60)}\n`);
    
    if (!res.headersSent) {
        res.status(err.status || 500).json({
            error: true,
            message: isDev ? err.message : 'Internal server error',
            errorId: isDev ? errorId : undefined,
            requestId: requestId,
            path: isDev ? req.path : undefined,
            timestamp: new Date().toISOString()
        });
    }
});

// ============================================
// 11. EXPORT PARA VERCEL
// ============================================
module.exports = app;
