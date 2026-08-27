# Dilyas Shop

AI-first catalog and stock management app for a Muslim scarf and hijab store launching online on the Lak Lak marketplace.

## Main workflow

1. Upload a product photo.
2. Enter the product name, material, color, size, cost price, selling price and quantity.
3. Gemini generates four Russian-language blocks: Instagram post, Lak Lak title, Lak Lak description and a ready prompt for an external image-generation AI.
4. Save the product to the catalog with its original photo, prices, quantity and generated content.
5. Update stock daily with simple **Приход** or **Продажа** movements.

## Stack

- Next.js App Router
- TypeScript strict
- Tailwind CSS
- Supabase PostgreSQL/Auth/Storage/Realtime
- Google Gemini via `@google/genai`
- Zod validation

## Storage

Original product photos are kept in the private `product-images` bucket. The app creates short-lived signed URLs for catalog previews.

## Development

1. Copy `.env.example` to `.env.local`.
2. Install dependencies with `npm install`.
3. Run `npm run dev`.

Database schema is managed through `supabase/migrations`.
