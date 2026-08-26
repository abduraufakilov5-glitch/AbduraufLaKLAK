# Dilyas Shop

Production-oriented inventory, orders, analytics and AI content management app for a Muslim scarf and hijab store. Dilyas Shop is the store brand; Lak Lak is the marketplace where products may be listed.

## Stack

- Next.js App Router
- TypeScript strict
- Tailwind CSS
- Supabase PostgreSQL/Auth/Storage/Realtime
- Google Gemini via `@google/genai`
- Zod validation

## AI Studio

- Generates Russian/Tajik product copy, SEO fields, characteristics and Lak Lak marketplace tags.
- Generates marketplace-ready product card images with Gemini `gemini-3.1-flash-image`.
- Keeps original and generated images in separate private Storage buckets.

## Development

1. Copy `.env.example` to `.env.local`.
2. Install dependencies with `npm install`.
3. Run `npm run dev`.

Database schema is managed exclusively through `supabase/migrations`.
