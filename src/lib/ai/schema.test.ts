import { describe, expect, it } from "vitest";
import { productCardSchema } from "./schema";

describe("productCardSchema", () => {
  it("accepts a complete structured card", () => {
    const result = productCardSchema.safeParse({
      seo_title_ru: "Платок",
      seo_title_tg: "Рӯймол",
      description_ru: "Описание",
      description_tg: "Тавсиф",
      short_description: "Коротко",
      characteristics: [{ name: "color", value: "black" }],
      laklak_tags: ["hijab"],
      keywords: ["scarf"],
      hashtags: ["#hijab"],
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing required output", () => {
    expect(productCardSchema.safeParse({ seo_title_ru: "Платок" }).success).toBe(false);
  });
});