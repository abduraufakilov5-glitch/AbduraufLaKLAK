import { GoogleGenAI } from "@google/genai";

export const GEMINI_MODEL = "gemini-3.7-flash";
export const GEMINI_IMAGE_MODEL = "gemini-3.1-flash-image";

const responseSchema = {
  type: "object",
  properties: {
    seo_title_ru: { type: "string" },
    seo_title_tg: { type: "string" },
    description_ru: { type: "string" },
    description_tg: { type: "string" },
    short_description: { type: "string" },
    characteristics: {
      type: "array",
      items: {
        type: "object",
        properties: { name: { type: "string" }, value: { type: "string" } },
        required: ["name", "value"],
      },
    },
    laklak_tags: { type: "array", items: { type: "string" } },
    keywords: { type: "array", items: { type: "string" } },
    hashtags: { type: "array", items: { type: "string" } },
  },
  required: [
    "seo_title_ru",
    "seo_title_tg",
    "description_ru",
    "description_tg",
    "short_description",
    "characteristics",
    "laklak_tags",
    "keywords",
    "hashtags",
  ],
};

export interface ProductAIInput {
  imageBase64: string;
  mimeType: string;
  category: string;
  material?: string;
  color?: string;
  size?: string;
  price?: number;
}

export interface AIProvider {
  generateProductCard(input: ProductAIInput): Promise<unknown>;
  generateProductImage(input: ProductAIInput): Promise<{ data: string; mimeType: string }>;
}

export class GeminiProvider implements AIProvider {
  private readonly client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  async generateProductCard(input: ProductAIInput) {
    const interaction = await this.client.interactions.create({
      model: GEMINI_MODEL,
      input: [
        {
          type: "text",
          text: `Create factual marketplace copy for Dilyas Shop. Lak Lak is only the marketplace where the product may be listed, not the store name. Never invent unknown characteristics. Category: ${input.category}. Material: ${input.material ?? "unknown"}. Color: ${input.color ?? "unknown"}. Size: ${input.size ?? "unknown"}. Price: ${input.price ?? "unknown"}. Output Russian and Tajik SEO copy plus Lak Lak marketplace tags, keywords and hashtags.`,
        },
        { type: "image", data: input.imageBase64, mime_type: input.mimeType },
      ],
      response_format: { type: "text", mime_type: "application/json", schema: responseSchema },
    });
    return interaction.output_text;
  }

  async generateProductImage(input: ProductAIInput) {
    const interaction = await this.client.interactions.create({
      model: GEMINI_IMAGE_MODEL,
      input: [
        {
          type: "text",
          text: `Create a premium e-commerce product card image for Dilyas Shop using the supplied product photo as the visual source. Preserve the product's actual appearance, color, material and proportions. Make the product the visual focus. Use a clean luxury Muslim fashion aesthetic, soft studio lighting, refined cream/off-white background with subtle dark brown and muted gold accents. Create a polished marketplace-ready composition in a 4:5 aspect ratio. Include tasteful, highly legible Russian text only when it materially improves the card: Dilyas Shop, the supplied product category/name if inferable, supplied color/size, and price ${input.price ?? ""} TJS. Do not invent product facts. Lak Lak is the marketplace, not the store brand. Do not add watermarks, logos, fake badges, extra products, or misleading claims. Keep the product faithful to the source image.`,
        },
        { type: "image", data: input.imageBase64, mime_type: input.mimeType },
      ],
      response_format: {
        type: "image",
        mime_type: "image/png",
        aspect_ratio: "4:5",
        image_size: "2K",
      },
    });

    if (!interaction.output_image?.data) {
      throw new Error("Gemini did not return an image");
    }

    return {
      data: interaction.output_image.data,
      mimeType: interaction.output_image.mime_type ?? "image/png",
    };
  }
}
