const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

router.post('/analyze', async (req, res) => {
  console.log('🌟 Requisição LoopAI recebida');
  
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      console.log('❌ Nenhuma URL de imagem fornecida');
      return res.status(400).json({ error: 'URL da imagem é obrigatória.' });
    }

    console.log('📸 URL da imagem:', imageUrl);

    if (!process.env.GEMINI_API_KEY) {
      console.error('❌ GEMINI_API_KEY não encontrada no arquivo .env');
      return res.status(500).json({ error: 'Chave da API Gemini não configurada.' });
    }

    console.log('🔑 Chave Gemini carregada:', process.env.GEMINI_API_KEY ? 'OK' : 'FALHA');
    console.log('🤖 Iniciando análise com Gemini...');

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
Você é a LoopAI, uma assistente especializada em sustentabilidade e reutilização criativa de objetos.

### 📋 Tarefas de Análise (Passo a Passo)

1.  **Identificação do Item:** Identifique claramente o objeto central na imagem (ex: pneu velho, garrafa PET, caixa de madeira, jeans rasgado).
2.  **Análise de Material e Condição:** Estime o material principal (ex: borracha, plástico, madeira, tecido) e a condição aparente (ex: intacto, desgastado, quebrado).
3.  **Geração de Ideias de Reutilização (Loop Ideas):**
    * Crie **três (3) ideias** de reutilização ou 'upcycling' com diferentes níveis de complexidade:
        * **Ideia 1: Simples e Rápida (Reutilização Direta):** Uma ideia que requer pouca ou nenhuma alteração no item.
        * **Ideia 2: Intermediária (Upcycling com Ferramentas Comuns):** Uma ideia que transforma o objeto em algo novo, requerendo ferramentas básicas (tesoura, cola, tinta).
        * **Ideia 3: Avançada (Transformação Criativa ou Funcional):** Uma ideia que resulta em uma peça funcional ou decorativa sofisticada, podendo requerer habilidades ou ferramentas específicas (costura, corte preciso).

### 💡 Formato de Resposta (Output)

Sua resposta deve ser estruturada de forma clara, amigável e inspiradora, utilizando Markdown (títulos, listas e negrito) para fácil leitura.

**Estrutura da Resposta:**

## ✨ LoopAI: Ideias Criativas para Reutilizar [Nome do Item Identificado]

Olá! Sou a LoopAI e analisei sua imagem. Vejo um **[Nome do Item Identificado]**, feito principalmente de **[Material Principal]** e em condição **[Condição Estimada]**. Você tem ótimas opções para evitar que ele vire lixo!

### 1. Loop Idea Simples (Reutilização Direta)
* **Nome:** [Nome curto e inspirador da ideia simples]
* **Como Fazer:** [Descrição breve e direta da ação.]

### 2. Loop Idea Intermediária (Upcycling Básico)
* **Nome:** [Nome curto e inspirador da ideia intermediária]
* **Como Fazer:** [Descrição clara dos passos e materiais básicos necessários.]

### 3. Loop Idea Avançada (Transformação Criativa)
* **Nome:** [Nome curto e inspirador da ideia avançada]
* **Como Fazer:** [Descrição detalhada dos passos de transformação e das habilidades/ferramentas necessárias.]

---

Analise a imagem fornecida e gere as ideias de reutilização seguindo exatamente o formato acima.
`;

    console.log('📥 Baixando imagem da URL...');
    
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString('base64');

    const mimeType = imageResponse.headers.get('content-type') || 'image/jpeg';

    console.log('📷 Imagem processada. MIME type:', mimeType);
    console.log('🔮 Gerando análise com IA...');

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageBase64,
          mimeType: mimeType,
        },
      },
    ]);

    const response = result.response;
    const text = response.text();

    console.log('✨ Análise LoopAI concluída com sucesso');

    res.status(200).json({
      success: true,
      analysis: text,
      imageUrl: imageUrl,
    });

  } catch (error) {
    console.error('❌ Erro ao analisar imagem com LoopAI:', error.message);
    res.status(500).json({
      error: 'Erro ao analisar imagem. Tente novamente.',
      details: error.message,
    });
  }
});

module.exports = router;
