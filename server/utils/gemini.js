const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateFromText(text) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
You are an AI assistant built for studying. I will provide you with a text. 
Read it carefully and generate the following three things based ONLY on the text:
1. summary: A brief summary in 3-5 sentences.
2. flashcards: An array of exactly 15 flashcards, each with a "question" and "answer".
3. quiz: An array of exactly 5 multiple choice questions. Each question must have a "question" string, an "options" array (exactly 4 strings), and a "correct" integer representing the index of the correct option (0-3).

Important Requirement: You must return ONLY valid JSON. No markdown formatting, no code blocks, no explanation. Just the raw JSON object. The JSON should match this schema:
{
  "summary": "...",
  "flashcards": [{"question": "...", "answer": "..."}],
  "quiz": [{"question": "...", "options": ["", "", "", ""], "correct": 0}]
}

Text to process:
${text}
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let textResponse = response.text();

        if (textResponse.startsWith('\`\`\`json')) {
            textResponse = textResponse.replace(/^\`\`\`json/, '').replace(/\`\`\`$/, '');
        } else if (textResponse.startsWith('\`\`\`')) {
            textResponse = textResponse.replace(/^\`\`\`/, '').replace(/\`\`\`$/, '');
        }

        return JSON.parse(textResponse.trim());
    } catch (error) {
        console.error("Gemini Generation Error: ", error);
        throw error;
    }
}

module.exports = { generateFromText };
