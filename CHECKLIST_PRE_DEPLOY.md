# ✅ CHECKLIST PROFISSIONAL PRÉ-DEPLOY VERCEL

**Desenvolvedor Sênior - Production Ready Validation**

---

## 🎯 OBJETIVO

Garantir que o projeto funcionará **100% identicamente** em local e Vercel, com **ZERO erro 500** e **logging profissional**.

---

## 📋 VALIDAÇÃO PRÉ-DEPLOY

### 1. AMBIENTE LOCAL

- [x] `npm install` - Todas dependências instaladas
- [x] `npm test` - Todos testes passam (100%)
- [x] `node test-vercel-production.js` - 7/7 cenários pass
- [x] `NODE_ENV=production npm start` - Sem erros
- [x] Acessar http://localhost:3000 - Carrega sem erro
- [x] Verificar console.log - Logging estruturado com requestId

### 2. COMPATIBILIDADE WINDOWS vs LINUX

- [x] Nenhum path com backslash `\` (usar `/`)
- [x] Nenhum import com case incorreto
- [x] `toLowerCase()` aplicado em todas filenames
- [x] Nenhum `__dirname` sem validação

### 3. ROTAS E ARQUIVOS

- [x] `/` → index.html (✅ 200)
- [x] `/sobre` → sobre.html (✅ 200)
- [x] `/contato` → contato.html (✅ 200)
- [x] `/empresa` → empresa.html (✅ 200)
- [x] Rota inexistente → index.html (SPA fallback ✅ 200)
- [x] `/api/health` → JSON (✅ 200)

### 4. STATIC FILES

- [x] CSS carrega via `/css/style.css` (✅ 200)
- [x] JS carrega (se houver)
- [x] Imagens carregam
- [x] Nenhum erro 404 no console do navegador

### 5. SEGURANÇA

- [x] Path traversal bloqueado (`/about/../../etc/passwd`)
- [x] Nenhum arquivo sensível exposto (package.json, .env)
- [x] Validação de path contra path traversal

### 6. ERROR HANDLING

- [x] Global error handler em lugar (último middleware)
- [x] Todos erros logados com requestId
- [x] Erro 500 nunca é genérico
- [x] Stack trace disponível em development

### 7. ENVIRONMENT VARIABLES

- [x] `process.env.NODE_ENV` definido (default = 'production')
- [x] Nenhuma referência a variáveis undefined
- [x] Health check retorna configuração correta

### 8. PERFORMANCE

- [x] Cache headers configurados (`maxAge: '1h'`)
- [x] ETags desabilitadas para serve-file
- [x] Nenhuma circular dependency
- [x] Bundle size aceitável

### 9. LOGGING

- [x] Request ID único por requisição
- [x] Tempo de resposta logado
- [x] Status HTTP logado
- [x] Erros incluem stack trace

### 10. GIT & CI/CD

- [x] Último commit pushado
- [x] GitHub Actions (se houver) passando
- [x] Vercel integration conectada
- [x] Build log limpo (sem warnings críticos)

---

## 🧪 TESTES MANUAIS FINAIS

### Terminal 1 - Executar servidor
```bash
NODE_ENV=production npm start
```
Esperado: Startup logs com verificação de path ✅

### Terminal 2 - Rodar testes
```bash
node test-vercel-production.js
```
Esperado: 7/7 testes passando ✅

### Terminal 3 - Validar endpoints
```bash
# Health check
curl http://localhost:3000/api/health | jq .

# Páginas
curl -I http://localhost:3000/
curl -I http://localhost:3000/sobre
curl -I http://localhost:3000/empresa
curl -I http://localhost:3000/contato

# SPA fallback
curl -I http://localhost:3000/random-page
```
Esperado: Todos 200 ✅

---

## 🚀 DEPLOYMENT CHECKLIST

### Antes de fazer Deploy

```bash
# 1. Verificar status local
NODE_ENV=production npm start &
sleep 2
node test-vercel-production.js

# 2. Verificar git
git status              # Nenhuma alteração não commitada
git log -1 --oneline   # Último commit visível

# 3. Push para GitHub
git push origin main

# 4. Acompanhar deploy Vercel
# URL: https://vercel.com/thiagovieira04s-projects/curriculum-facil
```

---

## ⚠️ DEBUGGING SE VERCEL FALHAR

### Passo 1: Verificar Logs do Vercel
```
https://vercel.com/thiagovieira04s-projects/curriculum-facil/logs
```

### Passo 2: Procurar por
- ❌ `FUNCTION_INVOCATION_FAILED` → Bundle muito grande
- ❌ `Cannot find module` → Dependência faltando
- ❌ `ENOENT` → Arquivo não encontrado (case issue!)
- ❌ `Error: EACCES` → Permissão negada
- ❌ `Module not found` → Import path incorreto

### Passo 3: Diagnosticar Localmente
```javascript
// Adicionar ao api/index.js temporariamente
console.log('PATH:', __dirname);
console.log('FILES:', fs.readdirSync(path.join(__dirname, '..', 'public')));
```

### Passo 4: Replicar Vercel Localmente
```bash
# Simular cold start
node -e "delete require.cache[Object.keys(require.cache)[0]]; require('./api/index.js')"

# Testar com NODE_ENV=production
NODE_ENV=production node api/index.js
```

---

## 📊 RESULTADO ESPERADO

| Métrica | Status |
|---------|--------|
| Tests Local | ✅ 7/7 |
| Vercel Build | ✅ Success |
| Erro 500 | ✅ 0 |
| Logging | ✅ Estruturado |
| Performance | ✅ < 200ms |
| Segurança | ✅ Path traversal blocked |

---

## 🎬 CONCLUSÃO

Se todos os itens acima estão checados ✅, seu projeto está **PRODUCTION-READY** e funcionará identicamente em:
- ✅ Local (Windows/Mac/Linux)
- ✅ Vercel (Linux Container)
- ✅ CI/CD Pipeline
- ✅ Production

**Sem surpresas. Sem erro 500. Sem debug maluco.**

---

**Data de Validação:** 2026-01-24  
**Desenvolvedor Sênior:** ✅ Aprovado  
**Pronto para Deploy:** ✅ SIM
