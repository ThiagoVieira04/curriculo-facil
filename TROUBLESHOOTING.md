# 🔧 Guia de Solução - "Failed to fetch"

Este guia ajuda a resolver o erro "Failed to fetch" no CurrículoFácil.

## 🚨 Problema
Quando você tenta gerar um currículo, aparece o erro "Failed to fetch" e o currículo não é criado.

## 🔍 Diagnóstico Rápido

### 1. Verificar se o servidor está rodando
```bash
# Verificar se há algum processo na porta 3000
netstat -ano | findstr :3000
```

### 2. Executar diagnóstico automático
```bash
npm run diagnose
```

### 3. Testar conectividade básica
```bash
npm run fix-fetch
```

## 🛠️ Soluções por Ordem de Prioridade

### Solução 1: Reiniciar o Servidor
```bash
# Parar o servidor (Ctrl+C se estiver rodando)
# Depois executar:
npm start
```

### Solução 2: Verificar Dependências
```bash
# Reinstalar dependências
npm install

# Verificar se todas estão instaladas
npm run diagnose
```

### Solução 3: Usar Servidor de Teste
```bash
# Executar servidor simplificado para teste
npm run fix-fetch

# Abrir http://localhost:3002
# Testar se o formulário funciona
```

### Solução 4: Verificar Porta
```bash
# Se a porta 3000 estiver ocupada, matar o processo:
# Windows:
taskkill /PID [PID_NUMBER] /F

# Ou usar porta diferente:
set PORT=3001 && npm start
```

### Solução 5: Modo de Desenvolvimento
```bash
# Usar nodemon para desenvolvimento
npm run dev
```

## 🧪 Testes de Conectividade

### Teste 1: Navegador
1. Abra http://localhost:3000
2. Pressione F12 (Console)
3. Execute: `fetch('/api/health').then(r => r.json()).then(console.log)`
4. Deve retornar: `{status: "OK", ...}`

### Teste 2: Formulário Simples
1. Abra http://localhost:3000/test.html
2. Execute os testes na página
3. Verifique se todos passam

### Teste 3: API Direta
```javascript
// No console do navegador:
fetch('/api/generate-cv', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        nome: 'Teste',
        cargo: 'Desenvolvedor', 
        email: 'teste@email.com',
        telefone: '11999999999',
        cidade: 'São Paulo',
        experiencia: 'Teste',
        formacao: 'Teste',
        habilidades: 'Teste'
    })
}).then(r => r.json()).then(console.log)
```

## 🔧 Correções Específicas

### Erro: "EADDRINUSE"
```bash
# Porta já está em uso
# Windows:
netstat -ano | findstr :3000
taskkill /PID [PID] /F

# Linux/Mac:
lsof -ti:3000 | xargs kill -9
```

### Erro: "Module not found"
```bash
# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

### Erro: "CORS"
- O servidor já está configurado com CORS
- Se persistir, use: `npm run fix-fetch` (CORS mais permissivo)

### Erro: "Network Error"
1. Verificar se está acessando http://localhost:3000 (não https)
2. Verificar firewall/antivírus
3. Testar em navegador diferente
4. Verificar se não há proxy/VPN interferindo

## 📋 Checklist de Verificação

- [ ] Node.js instalado (versão 16+)
- [ ] Dependências instaladas (`npm install`)
- [ ] Porta 3000 disponível
- [ ] Servidor iniciado sem erros
- [ ] Navegador acessando http://localhost:3000
- [ ] Console do navegador sem erros
- [ ] Firewall/antivírus não bloqueando

## 🆘 Se Nada Funcionar

### Opção 1: Servidor Simplificado
```bash
npm run test-server
# Acesse http://localhost:3000
```

### Opção 2: Modo Debug
```bash
# Ativar logs detalhados
set DEBUG=* && npm start
```

### Opção 3: Verificar Logs
- Verifique o console onde o servidor está rodando
- Procure por mensagens de erro em vermelho
- Anote a mensagem exata do erro

## 📞 Suporte

Se o problema persistir:

1. **Execute o diagnóstico completo:**
   ```bash
   npm run diagnose > diagnostico.txt
   ```

2. **Colete informações do sistema:**
   - Versão do Node.js: `node --version`
   - Sistema operacional
   - Navegador utilizado
   - Mensagem de erro exata

3. **Entre em contato:**
   - Email: contato@curriculofacil.com
   - WhatsApp: (21) 98717-2463

## 🎯 Solução Rápida (TL;DR)

```bash
# 1. Parar servidor (Ctrl+C)
# 2. Executar:
npm install
npm start

# 3. Abrir: http://localhost:3000
# 4. Se não funcionar:
npm run fix-fetch
# 5. Abrir: http://localhost:3002
```

---

**💡 Dica:** Na maioria dos casos, o problema é resolvido simplesmente reiniciando o servidor com `npm start`.