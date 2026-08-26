import { GoogleGenAI } from "@google/genai";

export const GEMINI_MODEL = "gemini-3.7-flash";
const responseSchema = { type: "object", properties: { seo_title_ru: { type: "string" }, seo_title_tg: { type: "string" }, description_ru: { type: "string" }, description_tg: { type: "string" }, short_description: { type: "string" }, characteristics: { type: "object", additionalProperties: { type: "string" } }, laklak_tags: { type: "array", items: { type: "string" } }, keywords: { type: "array", items: { type: "string" } }, hashtags: { type: "array", items: { type: "string" } } }, required: ["seo_title_ru","seo_title_tg","description_ru","description_tg","short_description","characteristics","laklak_tags","keywords","hashtags"] };

export interface AIProvider { generateProductCard(input: { imageBase64: string; mimeType: string; category: string; material?: string; color?: string; size?: string; price?: number }): Promise<unknown>; }

export class GeminiProvider implements AIProvider {
  private readonly client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  async generateProductCard(input: Parameters<AIProvider["generateProductCard"]>[0]) {
    const interaction = await this.client.interactions.create({
      model: GEMINI_MODEL,
      input: [
        { type: "text", text: `Create a factual product card from the image and supplied data. Never invent unknown characteristics. Category: ${input.category}. Material: ${input.material ?? "unknown"}. Color: ${input.color ?? "unknown"}. Size: ${input.size ?? "unknown"}. Price: ${input.price ?? "unknown"}. Output Russian and Tajik SEO copy plus tags/keywords/hashtags.` },
        { type: "image", data: input.imageBase64, mime_type: input.mimeType },
      ],
      response_format: { type: "text", mime_type: "application/json", schema: responseSchema },
    });
    return interaction.output_text;
  }
}