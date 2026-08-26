import { z } from "zod";

export const productCardSchema = z.object({
  seo_title_ru: z.string().min(1),
  seo_title_tg: z.string().min(1),
  description_ru: z.string().min(1),
  description_tg: z.string().min(1),
  short_description: z.string().min(1),
  characteristics: z.array(z.object({ name: z.string().min(1), value: z.string().min(1) })).max(30),
  laklak_tags: z.array(z.string()).max(30),
  keywords: z.array(z.string()).max(50),
  hashtags: z.array(z.string()).max(30),
});
export type ProductCard = z.infer<typeof productCardSchema>;