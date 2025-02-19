import { GoogleGenerativeAI } from '@google/generative-ai';

export const answerFromGenerativeAi = async (
  prompt: string,
): Promise<string> => {
  try {
    const genAI = new GoogleGenerativeAI(import.meta.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Error generating summary:', error);
    throw error;
  }
};
