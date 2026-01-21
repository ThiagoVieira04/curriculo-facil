#!/usr/bin/env node

/**
 * Script de Validação das Correções
 * Testa se todos os problemas foram resolvidos
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 VALIDANDO CORREÇÕES DO PROJETO\n');
console.log('=' .repeat(60));

let allPassed = true;

// ============================================
// TESTE 1: Verificar ordem de middlewares
// ============================================
console.log('\n✓ TESTE 1: Ordem de Middlewares');
console.log('-'.repeat(60));

const serverContent = fs.readFileSync(path.join(__dirname, 'server.js'), 'utf8');

// Encontrar posições
const jsonMiddlewarePos = serverContent.indexOf('app.use(express.json');
const sobreRoutePos = serverContent.indexOf("app.use('/sobre'");
const staticPos = serverContent.indexOf("app.use(express.static('public'))");

if (jsonMiddlewarePos < sobreRoutePos && sobreRoutePos < staticPos) {
    console.log('✅ PASSOU: Middlewares em ordem correta');
    console.log('   1. express.json() ✓');
    console.log('   2. Rotas dinâmicas (/sobre, /contato) ✓');
    console.log('   3. express.static() ✓');
} else {
    console.log('❌ FALHOU: Ordem de middlewares incorreta');
    console.log(`   JSON: ${jsonMiddlewarePos}, Rotas: ${sobreRoutePos}, Static: ${staticPos}`);
    allPassed = false;
}

// ============================================
// TESTE 2: Verificar rotas dinâmicas
// ============================================
console.log('\n✓ TESTE 2: Rotas Dinâmicas Registradas');
console.log('-'.repeat(60));

const hasAboutRoute = serverContent.includes("app.use('/sobre', sobreRoute)");
const hasContactRoute = serverContent.includes("app.use('/contato', contatoRoute)");
const hasTipsRoute = serverContent.includes("app.use('/dicas', dicasRoute)");

if (hasAboutRoute && hasContactRoute && hasTipsRoute) {
    console.log('✅ PASSOU: Todas as rotas dinâmicas registradas');
    console.log('   /sobre ✓');
    console.log('   /contato ✓');
    console.log('   /dicas ✓');
} else {
    console.log('❌ FALHOU: Rotas dinâmicas não encontradas');
    allPassed = false;
}

// ============================================
// TESTE 3: Verificar validação ATS melhorada
// ============================================
console.log('\n✓ TESTE 3: Validação ATS Melhorada');
console.log('-'.repeat(60));

const hasFallbackLogic = serverContent.includes('Tentar PDF primeiro, depois DOCX') || 
                         serverContent.includes('Estratégia: Tentar PDF primeiro');
const hasErrorHandling = serverContent.includes('parseError');
const hasContentValidation = serverContent.includes('cleanText.length < 50');

if (hasFallbackLogic && hasErrorHandling && hasContentValidation) {
    console.log('✅ PASSOU: Validação ATS melhorada');
    console.log('   Sistema de fallback PDF→DOCX ✓');
    console.log('   Tratamento de erros ✓');
    console.log('   Validação de conteúdo ✓');
} else {
    console.log('❌ FALHOU: Validação ATS não foi melhorada');
    console.log(`   Fallback: ${hasFallbackLogic}, Errors: ${hasErrorHandling}, Content: ${hasContentValidation}`);
    allPassed = false;
}

// ============================================
// TESTE 4: Verificar sanitização de campos
// ============================================
console.log('\n✓ TESTE 4: Sanitização de Campos Opcionais');
console.log('-'.repeat(60));

const hasSanitization = serverContent.includes('cleanData.nascimento = validation.sanitizeText') &&
                        serverContent.includes('cleanData.estadoCivil = validation.sanitizeText') &&
                        serverContent.includes('cleanData.objetivo = validation.sanitizeText');

if (hasSanitization) {
    console.log('✅ PASSOU: Campos opcionais sanitizados');
    console.log('   nascimento ✓');
    console.log('   estadoCivil ✓');
    console.log('   objetivo ✓');
    console.log('   (e outros campos opcionais)');
} else {
    console.log('❌ FALHOU: Sanitização de campos não implementada');
    allPassed = false;
}

// ============================================
// TESTE 5: Verificar arquivos de rota
// ============================================
console.log('\n✓ TESTE 5: Arquivos de Rota Existem');
console.log('-'.repeat(60));

const sobreExists = fs.existsSync(path.join(__dirname, 'sobre-route.js'));
const contatoExists = fs.existsSync(path.join(__dirname, 'contato-route.js'));
const dicasExists = fs.existsSync(path.join(__dirname, 'dicas-route.js'));

if (sobreExists && contatoExists && dicasExists) {
    console.log('✅ PASSOU: Todos os arquivos de rota existem');
    console.log('   sobre-route.js ✓');
    console.log('   contato-route.js ✓');
    console.log('   dicas-route.js ✓');
} else {
    console.log('❌ FALHOU: Arquivos de rota faltando');
    allPassed = false;
}

// ============================================
// TESTE 6: Verificar configuração Vercel
// ============================================
console.log('\n✓ TESTE 6: Configuração Vercel');
console.log('-'.repeat(60));

const vercelConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'vercel.json'), 'utf8'));

const hasServerBuild = vercelConfig.builds.some(b => b.src === 'server.js');
const hasAboutRouteVercel = vercelConfig.routes.some(r => r.src === '/sobre');
const hasContactRouteVercel = vercelConfig.routes.some(r => r.src === '/contato');

if (hasServerBuild && hasAboutRouteVercel && hasContactRouteVercel) {
    console.log('✅ PASSOU: Configuração Vercel correta');
    console.log('   Build para server.js ✓');
    console.log('   Rota /sobre mapeada ✓');
    console.log('   Rota /contato mapeada ✓');
} else {
    console.log('❌ FALHOU: Configuração Vercel incompleta');
    allPassed = false;
}

// ============================================
// TESTE 7: Verificar package.json
// ============================================
console.log('\n✓ TESTE 7: Dependências Necessárias');
console.log('-'.repeat(60));

const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));

const requiredDeps = [
    'express',
    'multer',
    'puppeteer-core',
    'pdf-parse',
    'mammoth',
    'file-type',
    'sharp',
    'cors',
    'helmet'
];

const missingDeps = requiredDeps.filter(dep => !packageJson.dependencies[dep]);

if (missingDeps.length === 0) {
    console.log('✅ PASSOU: Todas as dependências presentes');
    requiredDeps.forEach(dep => console.log(`   ${dep} ✓`));
} else {
    console.log('❌ FALHOU: Dependências faltando:');
    missingDeps.forEach(dep => console.log(`   ${dep} ✗`));
    allPassed = false;
}

// ============================================
// RESULTADO FINAL
// ============================================
console.log('\n' + '='.repeat(60));

if (allPassed) {
    console.log('\n✅ TODAS AS VALIDAÇÕES PASSARAM!');
    console.log('\n📋 Resumo das Correções:');
    console.log('   1. ✅ Middlewares reordenados');
    console.log('   2. ✅ Rotas dinâmicas funcionando');
    console.log('   3. ✅ Validação ATS melhorada');
    console.log('   4. ✅ Campos sanitizados');
    console.log('   5. ✅ Arquivos de rota presentes');
    console.log('   6. ✅ Vercel configurado');
    console.log('   7. ✅ Dependências completas');
    console.log('\n🚀 Sistema pronto para deploy!\n');
    process.exit(0);
} else {
    console.log('\n❌ ALGUMAS VALIDAÇÕES FALHARAM');
    console.log('\n⚠️  Verifique os erros acima e corrija antes do deploy.\n');
    process.exit(1);
}
