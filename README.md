# CopyCat

A premium, production-ready web application for organic AI dropshipping on TikTok — AI-generated TikTok videos, no ad spend, no TikTok Shop.

Temporary working name: **CopyCat** (defined in one central constant `APP_NAME` in `src/config.ts`).

## The Core Jobs
1. **See what went viral in the last 24 hours** — a feed of viral organic TikTok videos from the last day.
2. **Recreate it** — two ways:
   - **(a) In-app video generation**: pick a video → tailored concepts → generate (Wan 3.0, up to 30 seconds, 9:16, native audio).
   - **(b) Recreate on Claude**: copy a complete, ready-to-paste prompt with format details, hooks, 5-shot timestamps, caption, and video tool instructions.

Replaces Minea ($49/mo) + Higgsfield Plus ($59/mo) = $108/mo. CopyCat Starter is $49/mo (saves $59/mo).

---

## The Trial Model (Section 1)
There is exactly ONE free trial. It is NOT per-plan:
- **7 days, no card required** — no card collected, nothing charged automatically when it ends.
- **Trial Limits**: 24h leaderboard only, follow 1 creator only, 3 concept lists total, 2 × 10s videos at 480p (20 seconds total), watermarked. No clones, no heroes, no 720p/1080p, no Instagram, no ad library, no coin packs.
- Starts strictly from trial CTAs linking to `/auth/?trial=1`.
- When the trial ends, generation locks until a paid plan is selected.

---

## 5 Worker Secrets Needed on Backend (`dropship-api`)
These Cloudflare Worker secrets are configured in the Cloudflare dashboard (never in frontend code):
1. `ARGOLINK_API_KEY` (Wan 3.0 & Seedance 2.5 video rendering)
2. `OPENROUTER_API_KEY` (Claude 3.5 Sonnet concept generation)
3. `TREG_API_KEY` (Live TikTok velocity-ranked feed)
4. `FAL_API_KEY` (Kling O3 clone mode)
5. `HIGGSFIELD_API_KEY` (BYO Higgsfield API routing)

Plus Supabase and Stripe secrets once database migration `supabase/migrations/001_dropshipper.sql` is run.

---

## Environment Variables
Configured for future Supabase / Stripe integrations:
```env
NEXT_PUBLIC_API_URL=https://dropship-api.chideraezeudu2.workers.dev
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
```

---

## Running Locally

```bash
npm install
npm run dev
```

Build for production:
```bash
npm run build
```

Deployment target: Cloudflare Workers Static Assets or Cloudflare Pages / Vercel.
