const express = require('express');
const router = express.Router();

// Página de Contato
router.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Contato - CurrículoFácil</title>
            <meta name="description" content="Entre em contato com a equipe do CurrículoFácil. Tire suas dúvidas, envie sugestões ou reporte problemas.">
            <link rel="stylesheet" href="/css/style.css">
        </head>
        <body>
            <header>
                <nav>
                    <div class="container">
                        <h1><a href="/" style="text-decoration:none;color:inherit;">📄 CurrículoFácil</a></h1>
                        <div class="nav-links">
                            <a href="/">Início</a>
                            <a href="/sobre">Sobre</a>
                            <a href="/contato">Contato</a>
                        </div>
                    </div>
                </nav>
            </header>
            
            <main style="padding-top: 100px;">
                <div class="container" style="padding: 50px 20px;">
                    <h1>Entre em Contato</h1>
                    
                    <div style="max-width: 600px; margin: 0 auto;">
                        <h2>Fale Conosco</h2>
                        <p>Estamos aqui para ajudar! Se você tem dúvidas, sugestões ou encontrou algum problema, não hesite em nos contatar.</p>
                        
                        <div style="background: #f8fafc; padding: 30px; border-radius: 10px; margin: 30px 0;">
                            <h3>📧 Email</h3>
                            <p><strong>tsmv04@hotmail.com</strong></p>
                            <p>Respondemos em até 24 horas</p>
                            
                            <h3 style="margin-top: 30px;">🏢 Empresa</h3>
                            <p><strong>Papel e Sonhos Informática</strong></p>
                            <p>Especializada em soluções digitais para carreira e educação</p>
                            
                            <h3 style="margin-top: 30px;">⏰ Horário de Atendimento</h3>
                            <p>Segunda a Sexta: 9h às 18h</p>
                            <p>Sábados: 9h às 12h</p>
                        </div>
                        
                        <h2>Tipos de Contato</h2>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 20px 0;">
                            <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
                                <h4>🐛 Reportar Bug</h4>
                                <p>Encontrou algum problema técnico? Nos ajude a melhorar!</p>
                            </div>
                            <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
                                <h4>💡 Sugestões</h4>
                                <p>Tem ideias para novos recursos ou melhorias?</p>
                            </div>
                            <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
                                <h4>❓ Dúvidas</h4>
                                <p>Precisa de ajuda para usar nossa plataforma?</p>
                            </div>
                            <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0;">
                                <h4>🤝 Parcerias</h4>
                                <p>Interessado em parcerias comerciais?</p>
                            </div>
                        </div>
                        
                        <h2>Perguntas Frequentes</h2>
                        <div style="margin: 20px 0;">
                            <h4>O serviço é realmente gratuito?</h4>
                            <p>Sim! O CurrículoFácil é 100% gratuito e sempre será. Não cobramos nada para criar, visualizar ou baixar seu currículo.</p>
                            
                            <h4>Meus dados ficam seguros?</h4>
                            <p>Absolutamente. Seus dados são processados de forma segura e não são compartilhados com terceiros. Veja nossa <a href="/privacidade">Política de Privacidade</a>.</p>
                            
                            <h4>Posso usar o currículo comercialmente?</h4>
                            <p>Claro! O currículo gerado é seu e você pode usar da forma que desejar para buscar oportunidades de trabalho.</p>
                        </div>
                        
                        <p><strong>&copy; 2025 CurrículoFácil - Todos os direitos reservados à Papel e Sonhos Informática</strong></p>
                        
                        <p><a href="/">← Voltar ao início</a></p>
                    </div>
                </div>
            </main>
        </body>
        </html>
    `);
});