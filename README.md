# Kukio Provisioning Manifest

A standing grocery checklist for the White family's Kukio trips. Standing items
(★) are pre-checked from past visits; new items show a "new" badge until
confirmed. Check/uncheck what you want, adjust quantities, add anything new,
and hit **Generate list** to get a clean, copy-pasteable list to send to
Hoaka or the house manager — no login required on their end.

Everything is saved in the browser (localStorage), so the checklist remembers
your state between visits on the same device.

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Deploy to Vercel

**Easiest path — no command line needed:**
1. Create a new (empty) repository on GitHub and push this folder to it:
   ```bash
   git init
   git add .
   git commit -m "Kukio provisioning manifest v1"
   git branch -M main
   git remote add origin <your-new-repo-url>
   git push -u origin main
   ```
2. Go to https://vercel.com/new, sign in, and click **Import** next to that
   GitHub repo.
3. Leave all settings on their defaults (Vercel auto-detects Next.js) and
   click **Deploy**. You'll have a live `*.vercel.app` URL in about a minute.

**Alternative — Vercel CLI:**
```bash
npm install -g vercel
vercel login
vercel        # deploys a preview
vercel --prod # promotes to your production URL
```

## Where to make changes later

- `lib/masterList.ts` — the master item list itself (categories, standing vs.
  candidate status, default quantities, notes). Edit this directly to
  permanently add/remove/rename standing items for everyone.
- `lib/useManifestState.ts` — how checklist state is saved in the browser.
- `components/CategorySection.tsx` — one category block (checkbox, quantity,
  add-item row).
- `components/ExportPanel.tsx` — the "Generate list" popup and its formatting.
- `app/page.tsx` — page layout and the sticky action bar at the bottom.

## Known open items from the V1 analysis

These are called out inline in `lib/masterList.ts` as `note` fields, and are
worth resolving with Ben/Meredith directly:
1. Pineapple — 2 on one visit, 1 on the other. Pick a standing default.
2. Broccoli — whole heads vs. pre-cut florets. Same item, different format.
3. Salsa — "fresh medium salsa" vs. "pico de gallo, medium." Likely the same
   product, described two ways — confirm and merge if so.

Also worth flagging to Ben: this list reads like it's built around specific
meals (taco night, chicken alfredo, an Asian-dressed salad) rather than plain
staples. If that's intentional, a future version could group by meal/occasion
instead of (or in addition to) grocery category — worth asking before
investing in that restructure.

## Notes on this V1 build

- No backend/database yet — state lives in each browser's localStorage, which
  matches Ben's request for something simple rather than a login-based system.
- If Ben/Meredith and the house manager need to share one *live* list across
  devices (rather than each generating their own from memory), the natural
  next step is swapping localStorage for a small hosted store (Vercel KV or
  Postgres) behind a couple of API routes — the component structure here is
  already split so that swap wouldn't touch the UI.
