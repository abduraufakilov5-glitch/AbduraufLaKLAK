# AI Store

Production-oriented inventory, orders, analytics and AI content management app for a Muslim scarf and hijab store.

## Stack

- Next.js App Router
- TypeScript strict
- Tailwind CSS
- Supabase PostgreSQL/Auth/Storage/Realtime
- Google Gemini via `@google/genai`
- Zod validation

## Development

1. Copy `.env.example` to `.env.local`.
2. Install dependencies with `npm ci`.
3. Run `npm run dev`.

Database schema is managed exclusively through `supabase/migrations`.
