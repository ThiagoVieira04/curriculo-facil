# 📄 CurrículoFácil - Gerador Automático de Currículos

Sistema completo para criação automática de currículos profissionais com IA, 100% gratuito e monetizado com anúncios.

## 🚀 Funcionalidades

- ✅ Criação de currículo em 3 minutos
- ✅ Upload e processamento automático de fotos
- ✅ Melhoria de texto com IA
- ✅ 3 modelos profissionais
- ✅ Preview em tempo real
- ✅ Download PDF gratuito (sem marca d'água)
- ✅ Link compartilhável
- ✅ Integração Google AdSense
- ✅ Links de afiliados estratégicos
- ✅ Mobile-first e responsivo
- ✅ SEO otimizado

## 🛠️ Stack Tecnológica

- **Frontend**: HTML5, CSS3, JavaScript vanilla
- **Backend**: Node.js + Express
- **PDF**: Puppeteer
- **Processamento de Imagem**: Sharp
- **Deploy**: Vercel
- **IA**: Claude API (configurável)

## 📦 Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/gerador-curriculos.git
cd gerador-curriculos
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
# Crie um arquivo .env
CLAUDE_API_KEY=sua_chave_claude_api
ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxx
```

4. **Execute em desenvolvimento**
```bash
npm run dev
```

5. **Acesse**
```
http://localhost:3000
```

## 🌐 Deploy na Vercel

1. **Instale a CLI da Vercel**
```bash
npm i -g vercel
```

2. **Faça o deploy**
```bash
vercel --prod
```

3. **Configure as variáveis de ambiente na Vercel**
- CLAUDE_API_KEY
- ADSENSE_CLIENT_ID

## 💰 Estratégia de Monetização

### Google AdSense
- **Banner superior**: Após o hero da landing page
- **Banner formulário**: No meio do formulário de criação
- **Banner preview**: Após a geração do currículo
- **Sidebar**: Para desktop (escondido no mobile)

### Links de Afiliados
- **Cursos profissionalizantes**: Hotmart, Udemy
- **Plataformas de emprego**: Vagas.com, LinkedIn
- **Ferramentas profissionais**: Canva Pro, Office 365

## 📊 SEO e Marketing

### Palavras-chave Principais
- "criar currículo grátis"
- "gerador de currículo online"
- "currículo profissional"
- "fazer currículo"
- "modelo de currículo"

### Estratégias
1. **Content Marketing**: Blog com dicas de carreira
2. **Social Media**: Templates no Instagram/Pinterest
3. **Email Marketing**: Newsletter com dicas
4. **Parcerias**: Influenciadores de RH

## 🎨 Templates Disponíveis

### 1. Simples
- Ideal para primeiro emprego
- Layout clean e profissional
- Foco na legibilidade

### 2. Moderno
- Design com gradiente
- Para profissionais experientes
- Visual impactante

### 3. Executivo
- Estilo clássico e elegante
- Para cargos de liderança
- Tipografia sofisticada

## 🤖 Integração com IA

### Melhorias Automáticas
- Correção de português
- Linguagem mais profissional
- Adaptação ao cargo desejado
- Otimização para ATS

### Configuração Claude API
```javascript
// Em server.js, substitua a função improveTextWithAI
async function improveTextWithAI(text, context) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.CLAUDE_API_KEY,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: 'claude-3-sonnet-20240229',
            max_tokens: 1000,
            messages: [{
                role: 'user',
                content: `Melhore este texto de currículo (${context}): ${text}`
            }]
        })
    });
    
    const data = await response.json();
    return data.content[0].text;
}
```

## 📱 Fluxo do Usuário

1. **Landing Page**
   - CTA forte: "Criar Currículo Grátis"
   - Benefícios claros
   - Prova social

2. **Formulário**
   - Campos obrigatórios mínimos
   - Upload de foto opcional
   - Auto-save dos dados

3. **Processamento**
   - IA melhora os textos
   - Foto é redimensionada
   - Template é aplicado

4. **Preview**
   - Visualização do resultado
   - Opções de download e compartilhamento
   - Sugestões de próximos passos

## 🔧 Customizações

### Adicionar Novo Template
```javascript
// Em server.js, adicione ao objeto templates
novoTemplate: (data) => `
    <div style="seu-css-aqui">
        <h1>${data.nome}</h1>
        <!-- Seu HTML aqui -->
    </div>
`
```

### Modificar Melhorias de IA
```javascript
// Personalize as melhorias em improveTextWithAI
const improvements = {
    experiencia: (text) => {
        // Suas regras de melhoria
        return text.replace(/padrão/gi, 'melhorado');
    }
};
```

## 📈 Analytics e Métricas

### KPIs Importantes
- Taxa de conversão (visitante → currículo criado)
- Taxa de download de PDF
- Tempo na página
- Taxa de compartilhamento
- Revenue por usuário (RPU)

### Google Analytics
```html
<!-- Adicione no <head> de index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🛡️ Segurança

- Validação de uploads (tipo e tamanho)
- Sanitização de inputs
- Rate limiting
- Headers de segurança (Helmet.js)
- HTTPS obrigatório

## 📞 Suporte

Para dúvidas ou sugestões:
- Email: contato@curriculofacil.com
- GitHub Issues: [Link do repositório]

## 📄 Licença

MIT License - Veja o arquivo LICENSE para detalhes.

---

**Desenvolvido com ❤️ pela Papel e Sonhos Informática para ajudar pessoas a conseguirem melhores oportunidades de trabalho.**