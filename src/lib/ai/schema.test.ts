import { describe, expect, it } from "vitest";
import { productCardSchema } from "./schema";

describe("productCardSchema", () => {
  it("accepts the four required content outputs", () => {
    const result = productCardSchema.safeParse({
      instagram_text: "Лёгкий мусульманский платок для повседневного образа.",
      marketplace_title: "Мусульманский платок из габардина, чёрный",
      marketplace_description: "Чёрный платок из габардина. Размер 70×70 см.",
      image_prompt: "Premium e-commerce product photo of the supplied black scarf...",
    });
    expect(result.success).toBe(true);
  });

  it("rejects incomplete output", () => {
    expect(productCardSchema.safeParse({ instagram_text: "Текст" }).success).toBe(false);
  });
});
