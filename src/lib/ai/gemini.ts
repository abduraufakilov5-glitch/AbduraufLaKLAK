import { GoogleGenAI } from "@google/genai";

export const GEMINI_MODEL = "gemini-3.7-flash";

const responseSchema = {
  type: "object",
  properties: {
    instagram_text: { type: "string" },
    marketplace_title: { type: "string" },
    marketplace_description: { type: "string" },
    image_prompt: { type: "string" },
  },
  required: ["instagram_text", "marketplace_title", "marketplace_description", "image_prompt"],
};

export interface ProductAIInput {
  imageBase64: string;
  mimeType: string;
  name: string;
  category: string;
  material?: string;
  color?: string;
  size?: string;
  sellingPrice?: number;
}

export interface AIProvider {
  generateProductCard(input: ProductAIInput): Promise<unknown>;
}

export class GeminiProvider implements AIProvider {
  private readonly client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  async generateProductCard(input: ProductAIInput) {
    const interaction = await this.client.interactions.create({
      model: GEMINI_MODEL,
      input: [
        {
          type: "text",
          text: `Create Russian-language e-commerce content for the Muslim fashion store Dilyas Shop. The same product may be listed on the Lak Lak marketplace. Use only facts supplied by the user or clearly visible in the photo. Never invent material, composition, features, measurements, certifications, or benefits. Product name: ${input.name}. Category: ${input.category}. Material: ${input.material ?? "unknown"}. Color: ${input.color ?? "unknown"}. Size: ${input.size ?? "unknown"}. Selling price: ${input.sellingPrice ?? "unknown"} TJS. Return exactly four fields. 1) instagram_text: a natural Instagram post, concise and attractive, with a few relevant emojis and no fake claims. 2) marketplace_title: clear Lak Lak listing title, informative and keyword-friendly without spam. 3) marketplace_description: structured Russian marketplace description focused on real product facts and practical details. 4) image_prompt: a detailed prompt in Russian for another image-generation AI to create a premium 4:5 marketplace product card using the supplied photo as the visual source. Tell the other AI to preserve the exact product appearance and never invent details. Do not generate Tajik text, hashtags, tags, or an image yourself.`,
        },
        { type: "image", data: input.imageBase64, mime_type: input.mimeType },
      ],
      response_format: { type: "text", mime_type: "application/json", schema: responseSchema },
    });
    return interaction.output_text;
  }
}
