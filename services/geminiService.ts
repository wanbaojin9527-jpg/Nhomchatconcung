
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

export const generateSmartReply = async (messageHistory: { role: 'user' | 'model', content: string }[]) => {
  if (!API_KEY) return "Xin lỗi, hiện tại tôi không thể trả lời.";

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const model = 'gemini-3-flash-preview';
    
    const contents = messageHistory.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
    }));

    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction: "Bạn là một trợ lý thông minh tích hợp trong ứng dụng tin nhắn Connect Plus. Hãy trả lời ngắn gọn, thân thiện và tự nhiên như một người bạn thật sự. Ngôn ngữ: Tiếng Việt.",
        temperature: 0.8,
        maxOutputTokens: 100
      }
    });

    return response.text || "Đã có lỗi xảy ra.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Tôi đang bận một chút, thử lại sau nhé!";
  }
};
