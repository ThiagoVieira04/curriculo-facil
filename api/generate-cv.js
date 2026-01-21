export default async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const body = req.body;
        
        // Se for FormData, Express já converte para objeto
        const { nome, cargo, email, telefone, cidade, experiencia, formacao, habilidades, template = 'simples' } = body;

        // Validação
        if (!nome || !cargo || !email || !telefone || !cidade || !experiencia || !formacao || !habilidades) {
            return res.status(400).json({ error: 'Campos obrigatórios faltando' });
        }

        // Template
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 750px; margin: 0 auto; padding: 40px; line-height: 1.6; background: white;">
                <div style="display: flex; align-items: center; gap: 30px; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 30px;">
                    <div>
                        <h1 style="margin: 0; color: #333; font-size: 28px;">${String(nome).replace(/</g, '&lt;').replace(/>/g, '&gt;')}</h1>
                        <h2 style="margin: 10px 0; color: #666; font-size: 20px; font-weight: normal;">${String(cargo).replace(/</g, '&lt;').replace(/>/g, '&gt;')}</h2>
                        <p style="margin: 10px 0; color: #666; font-size: 14px;">📧 ${String(email).replace(/</g, '&lt;').replace(/>/g, '&gt;')} | 📱 ${String(telefone).replace(/</g, '&lt;').replace(/>/g, '&gt;')} | 📍 ${String(cidade).replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
                    </div>
                </div>
                <div style="margin-bottom: 25px;">
                    <h3 style="color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px;">EXPERIÊNCIA PROFISSIONAL</h3>
                    <p style="text-align: justify;">${String(experiencia).replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
                </div>
                <div style="margin-bottom: 25px;">
                    <h3 style="color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px;">FORMAÇÃO</h3>
                    <p style="text-align: justify;">${String(formacao).replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
                </div>
                <div style="margin-bottom: 25px;">
                    <h3 style="color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px;">HABILIDADES</h3>
                    <p style="text-align: justify;">${String(habilidades).replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
                </div>
            </div>
        `;

        const cvId = Date.now().toString(36) + Math.random().toString(36).substr(2, 9);

        return res.status(200).json({
            id: cvId,
            html: html,
            nome: nome,
            template: template,
            message: 'Currículo gerado com sucesso!'
        });

    } catch (error) {
        console.error('Erro ao gerar currículo:', error);
        return res.status(500).json({ error: 'Erro ao gerar currículo', message: error.message });
    }
};
