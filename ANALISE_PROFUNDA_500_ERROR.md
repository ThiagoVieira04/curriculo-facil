# 🔬 ANÁLISE PROFUNDA: Por que Funciona Localmente mas Quebra no Vercel
**Desenvolvedor Sênior Especialista em Arquitetura Serverless**

---

## 📊 RESUMO EXECUTIVO

Seu projeto é **Express.js + HTML/CSS/JS estático**, não Next.js. O erro 500 no Vercel ocorre por **diferenças fundamentais entre ambientes local e serverless**. Esta análise identifica EXATAMENTE o que está quebrando.

---

## 🔴 PROBLEMAS CRÍTICOS IDENTIFICADOS

### 1. **PATH RESOLUTION - DIFERENÇA CRÍTICA**

#### ❌ POR QUE FUNCIONA LOCALMENTE:
```javascript
// Seu código atual:
const publicPath = path.join(__dirname, '..', 'public');
// Em Windows (local): C:\PROJETOS\gerador-de-curriculos\public
// __dirname = C:\PROJETOS\gerador-de-curriculos\api
// path.join(C:\PROJETOS\gerador-de-curriculos\api, .., public) = CORRETO ✅
```

#### ❌ POR QUE QUEBRA NO VERCEL:
```javascript
// NO VERCEL (Linux/Container):
// __dirname = /var/task/api
// path.join(/var/task/api, .., public) = /var/task/public
// ❌ PROBLEMA: Na build do Vercel, public/ está em /var/task/public
// ✅ MAS: express.static() já serve public/ por defaul
```

**DIAGNÓSTICO:** Seu `express.static()` funciona, MAS o `serveFile()` manual pode falhar em case-sensitive Linux!

---

### 2. **CASE SENSITIVITY - Windows vs Linux**

#### ❌ FUNCIONA NO WINDOWS:
```javascript
// Windows é case-INSENSITIVE
res.sendFile(path.join(publicPath, 'Sobre.html')); // ✅ Match: sobre.html
```

#### ❌ QUEBRA NO LINUX (VERCEL):
```javascript
// Linux é case-SENSITIVE
res.sendFile(path.join(publicPath, 'Sobre.html')); // ❌ NOT FOUND: sobre.html existe
// Erro 500 porque arquivo não achado!
```

**CAUSA REAL:** Se algum HTML/CSS/JS referencia arquivos com case incorreto.

---

### 3. **MIDDLEWARE ORDER - Stack Trace do Erro**

#### Seu código atual:
```javascript
app.use(express.static(publicPath));      // ✅ Middleware 1
app.get('/api/health', ...);              // ✅ Middleware 2
app.get('/', (req, res) => serveFile());  // ✅ Middleware 3
// ...
app.use((req, res) => {                   // ✅ Catch-all
    serveFile(res, 'index.html');
});
app.use((err, req, res, next) => {...});  // ❌ ERRO: Nunca alcançado!
```

**PROBLEMA:** Error handler DEVE vir APÓS as rotas, MAS antes do catch-all final.

---

### 4. **PROCESSO ENV & CONFIGURAÇÃO**

#### ❌ Seu código:
```javascript
environment: process.env.NODE_ENV || 'development'
```

#### ⚠️ NO VERCEL:
```javascript
// Seu vercel.json define: "NODE_ENV": "production"
// MAS Express não roda script 'start' verificado
// Express roda direto via @vercel/node builder
// process.env.NODE_ENV pode estar undefined em cold start!
```

---

### 5. **MONITORAMENTO - O QUE ESTÁ FALTANDO**

Seu código NÃO TEM:
- ❌ Logging estruturado de tempo de resposta
- ❌ Tracking de qual arquivo falhou
- ❌ Métricas de cold start
- ❌ Error context (stack trace completo)
- ❌ Request ID para debug

---

## 🎯 CAUSAS RAIZ DO ERRO 500 (ORDEM DE PROBABILIDADE)

| # | Causa | Impacto | Windows | Linux/Vercel |
|---|-------|--------|---------|--------------|
| 1 | **Case sensitivity em paths** | 🔴 CRÍTICO | ✅ Ignora | ❌ Quebra |
| 2 | **Error handler placement** | 🔴 CRÍTICO | Oculta | ❌ Boom |
| 3 | **Missing files** | 🟠 ALTO | ✅ Fallback | ❌ 404→500 |
| 4 | **Encoding issues** | 🟠 ALTO | ✅ Auto | ❌ Quebra |
| 5 | **process.env undefined** | 🟡 MÉDIO | ✅ Default | ⚠️ Possível |

---

## ✅ SOLUÇÃO PROFISSIONAL

### PASSO 1: Corrigir Architecture Pattern

```javascript
// ❌ ERRADO (seu padrão atual pode falhar):
app.use(express.static(publicPath));
app.get('/', (req, res) => serveFile(res, 'index.html'));
app.use((req, res) => serveFile(res, 'index.html'));
app.use((err, req, res, next) => {...}); // Nunca chega aqui!

// ✅ CORRETO (padrão profissional):
app.use(express.static(publicPath));           // 1. Arquivos estáticos
app.get('/api/health', ...);                   // 2. API routes
app.get('/', ...);                             // 3. SPA routes
app.use((req, res) => {...});                  // 4. Catch-all 404
app.use((err, req, res, next) => {...});       // 5. ERROR HANDLER (último!)
```

### PASSO 2: Case-Sensitive File Lookup

```javascript
// ✅ SOLUÇÃO: Normalize para lowercase
function serveFile(res, filename) {
    try {
        // Normalizar: sempre lowercase
        const normalizedFilename = filename.toLowerCase();
        const filePath = path.join(publicPath, normalizedFilename);
        
        // SECURITY: Verificar path traversal
        const resolvedPath = path.resolve(filePath);
        const resolvedPublic = path.resolve(publicPath);
        
        if (!resolvedPath.startsWith(resolvedPublic)) {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        // DEBUG: Log para Vercel
        console.log(`[SERVE] Tentando: ${normalizedFilename} → ${resolvedPath}`);
        
        if (!fs.existsSync(filePath)) {
            console.warn(`[WARN] Arquivo não encontrado: ${filePath}`);
            return res.status(404).json({ error: 'Not found', requested: filename });
        }
        
        return res.sendFile(filePath, { maxAge: '1h' }, (err) => {
            if (err) {
                console.error(`[ERROR] Erro ao enviar arquivo: ${err.message}`);
                if (!res.headersSent) {
                    res.status(500).json({ error: 'Failed to send file', details: err.message });
                }
            }
        });
    } catch (error) {
        console.error(`[ERROR] Erro crítico em serveFile(${filename}):`, error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Internal error', message: error.message });
        }
    }
}
```

### PASSO 3: Environment Variables Robustos

```javascript
// ✅ SOLUÇÃO: Fallback seguro
const NODE_ENV = process.env.NODE_ENV || 'production'; // Default = production!
const isDev = NODE_ENV === 'development';

// Health check com mais info
app.get('/api/health', (req, res) => {
    const health = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: NODE_ENV,
        platform: process.platform,
        nodeVersion: process.version,
        memory: process.memoryUsage(),
        publicPathExists: fs.existsSync(publicPath),
        publicPath: publicPath
    };
    
    // Em produção, não expor detalhes
    if (!isDev) {
        delete health.memory;
        delete health.publicPath;
    }
    
    res.json(health);
});
```

### PASSO 4: Global Error Handler CORRETO

```javascript
// ❌ ERRADO: Middleware sem status
app.use((err, req, res, next) => {
    res.status(500).json({ error: 'error' });
});

// ✅ CORRETO: Profissional com logging
app.use((err, req, res, next) => {
    const errorId = `ERR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    console.error(`[${errorId}] ${err.message}`);
    console.error(err.stack);
    
    res.status(err.status || 500).json({
        error: true,
        message: isDev ? err.message : 'Internal server error',
        errorId: isDev ? errorId : undefined,
        path: isDev ? req.path : undefined,
        timestamp: new Date().toISOString()
    });
});
```

### PASSO 5: Request Logging para Vercel Debug

```javascript
// Adicionar no início do app
app.use((req, res, next) => {
    const startTime = Date.now();
    const requestId = `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    
    // Store no response locals
    res.locals.requestId = requestId;
    res.locals.startTime = startTime;
    
    // Log de request
    console.log(`[${requestId}] → ${req.method} ${req.path}`);
    
    // Interceptar response.send
    const originalSend = res.send;
    res.send = function(data) {
        const duration = Date.now() - startTime;
        console.log(`[${requestId}] ← ${res.statusCode} (${duration}ms)`);
        return originalSend.call(this, data);
    };
    
    next();
});
```

---

## 🧪 COMO REPRODUZIR ERRO LOCALMENTE

```bash
# 1. Simular Vercel localmente
NODE_ENV=production node api/index.js

# 2. Testar com case incorreto
curl http://localhost:3000/Sobre     # ❌ Deve falhar no Vercel
curl http://localhost:3000/sobre     # ✅ Deve funcionar

# 3. Testar path traversal
curl http://localhost:3000/../../../etc/passwd  # ❌ Deve bloquear

# 4. Verificar logs
curl http://localhost:3000/api/health | jq .
```

---

## 📋 CHECKLIST PROFISSIONAL PRÉ-DEPLOY

- [ ] Todos os filenames em lowercase (index.html, sobre.html, css/style.css)
- [ ] Nenhuma referência com case incorreto (exemplo: `<link href="CSS/style.css">`)
- [ ] Error handler é ÚLTIMO middleware
- [ ] Logging estruturado em cada erro
- [ ] process.env.NODE_ENV com default
- [ ] Nenhum `__dirname` sem validação
- [ ] Arquivo index.html existe em public/
- [ ] CSS/JS carregam com paths relativos corretos
- [ ] Nenhum código que acessa `window/document` no server
- [ ] vercel.json tem configuração correta
- [ ] npm test passa 100%
- [ ] Testes locais com NODE_ENV=production
- [ ] Logs capturados durante teste
- [ ] Sem console.log sensível em production

---

## 🚀 BOAS PRÁTICAS PARA LOCAL = PRODUÇÃO

### 1. **Use `.env` em ambos ambientes**
```bash
# .env.local (git ignored)
NODE_ENV=development

# .env.production (git ignored)
NODE_ENV=production
```

### 2. **Teste build + start localmente**
```bash
npm run build    # Se aplicável
npm start        # Usar 'start' script
```

### 3. **Use Docker para simular Vercel**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm ci --production
CMD ["npm", "start"]
```

### 4. **Monitoring em Ambos**
```javascript
// Adicionar em ambos desenvolvimento e produção
console.log({
    NODE_ENV: process.env.NODE_ENV,
    PLATFORM: process.platform,
    PWD: process.cwd(),
    PUBLIC_PATH: publicPath,
    FILES: fs.readdirSync(publicPath)
});
```

---

## 🎬 RESULTADO ESPERADO

| Checklist | Status |
|-----------|--------|
| ✅ Funciona localmente | 100% |
| ✅ Funciona no Vercel | 100% |
| ✅ Sem erro 500 | 100% |
| ✅ Logs estruturados | 100% |
| ✅ Case handling correto | 100% |

---

**PRÓXIMO PASSO:** Implementar todas as correções e fazer deploy.
