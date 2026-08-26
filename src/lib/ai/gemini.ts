import { GoogleGenAI } from "@google/genai";

export const GEMINI_MODEL = "gemini-3.7-flash";

export interface AIProvider {
  generateProductCard(input: { imageBase64: string; mimeType: string; category: string; material?: string; color?: string; size?: string; price?: number }): Promise<unknown>;
}

export class GeminiProvider implements AIProvider {
  private readonly client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  async generateProductCard(input: Parameters<AIProvider["generateProductCard"]>[0]) {
    const response = await this.client.models.generateContent({
      model: GEMINI_MODEL,
      contents: [{ text: `Create a factual product card. Never invent unknown characteristics. Category: ${input.category}. Material: ${input.material ?? "unknown"}. Color: ${input.color ?? "unknown"}. Size: ${input.size ?? "unknown"}. Price: ${input.price ?? "unknown"}. Return Russian/Tajik SEO titles, descriptions, short description, characteristics, Lak Lak tags, keywords and hashtags.` }, { inlineData: { mimeType: input.mimeType, data: input.imageBase64 } }],
      config: { responseMimeType: "application/json" },
    });
    return response.text;
  }
}