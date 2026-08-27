import { z } from "zod";

export const productCardSchema = z.object({
  instagram_text: z.string().min(1),
  marketplace_title: z.string().min(1),
  marketplace_description: z.string().min(1),
  image_prompt: z.string().min(1),
});

export type ProductCard = z.infer<typeof productCardSchema>;
