# Crux8 Play 🧗

Viral mobile mini-game: **"What Type of Climber Are You? / 你是哪种攀岩搭子？"**

A 30–60 second, no-login personality quiz that ends in a shareable, branded result card. First game in a reusable engine built for future Crux8 mini-games.

## Stack
- Next.js 14 (App Router) · React · TypeScript · Tailwind · Framer Motion
- Supabase — optional, aggregate analytics only (no auth, no answers, no PII)
- PostHog — optional event analytics
- html-to-image — client-side share-card PNG generation
- Vercel — deployment

**Everything except Next/React is optional.** With no env vars set, the game is fully playable; analytics simply no-op and the counter shows an invite instead of a fabricated headcount.

## Run locally
```bash
npm install
cp .env.example .env.local   # optional — fill in only what you have
npm run dev                  # http://localhost:3000
npm run build && npm run start  # production build
```

## Architecture (add games without a rewrite)
```
app/            layout (SEO/OG), page (mounts engine), opengraph-image (dynamic OG)
components/     GameEngine (state machine) + Landing / QuestionCard / ProgressBar
                / ResultScreen / ShareCard / StatBar / BackgroundFX  — all game-agnostic
lib/            gameTypes (engine contract), scoring helpers, analytics, supabase, session
games/
  climber-personality/   questions.ts · results.ts · scoring.ts · index.ts
```
A game is just a `GameDefinition` (see `lib/gameTypes.ts`). To ship a new one, drop a folder in `games/`, implement the contract, and pass it to `<GameEngine game={...} />`. The engine, animations, share card, and analytics are reused as-is.

**Scoring** is 100% deterministic (`games/*/scoring.ts`) — no LLM. Ties break via a fixed dimension priority seeded by the session id, so results are consistent.

## Analytics events
`page_view · game_started · question_answered · game_completed · result_viewed · share_clicked · share_success · play_again · crux8_cta_clicked` — each with timestamp, game_id, session_id, result_type, referral_source, device_type. Analytics are wrapped so a failure **never blocks gameplay**.

## Supabase
Run `supabase/schema.sql` in the SQL editor (single `game_sessions` table + anon RLS policies). Once real completed sessions exist, the landing counter shows the live number; until then it shows "Join the Crux8 climbing community" rather than a fake count.

## Deploy to Vercel
1. Push this folder to a Git repo.
2. Import into Vercel (framework auto-detected as Next.js).
3. Add env vars from `.env.example` (all optional). Set `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_CRUX8_URL`.
4. Deploy. OG image is generated dynamically at `/opengraph-image`.

## Future-ready (not in MVP)
- **AI**: personalized descriptions / compatibility via `app/api/*` → server-side provider (keys never in the client). Engine already returns structured result data.
- **Monetization**: `/play/[game]?sponsor=xxx` + sponsor/campaign/promo fields on `game_sessions`.
- **More games**: `gym-personality`, `climbing-partner`, `climbing-compatibility`, …

## Definition of Done
Landing, start, 5 questions, tap interaction, progress bar, deterministic scoring, 4 types, result + stat animations, share card, Web Share w/ download fallback, Crux8 CTA, analytics events, Supabase-failure resilience, 390×844 mobile layout, passing production build, no exposed secrets — all ✅.
