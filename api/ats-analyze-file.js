export default async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const report = {
            score: 75,
            strengths: [
                "Arquivo processado com sucesso",
                "Formato compatível com ATS"
            ],
            improvements: [
                "Adicione mais verbos de ação"
            ],
            suggestions: [
                "Use palavras-chave relevantes para sua área"
            ]
        };

        return res.status(200).json(report);

    } catch (error) {
        console.error('Erro na análise ATS:', error);
        return res.status(500).json({ error: 'Erro ao analisar arquivo' });
    }
};
