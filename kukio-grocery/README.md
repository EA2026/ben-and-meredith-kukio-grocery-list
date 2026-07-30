# Ben & Meredith's Grocery List — Kukio

A standing grocery checklist for the White family's Kukio trips. Standing items
(★) are pre-checked from past visits; new items show a "new" badge until
confirmed. Check/uncheck what you want, adjust quantities, add anything new,
and hit **Generate list** to get a clean, copy-pasteable list to send to
Hoaka or the house manager — no login required on their end.

Everything you check/type is saved locally as you go, and hitting **Save to
history** (inside "Generate list") records that visit in a shared database
everyone connected to this app can see — see the one-time setup step below.

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

## One-time setup: turn on shared storage

This version adds a shared catalog and visit history — so if Ben checks
something off on his phone, Julie sees the same list on her laptop. That
needs a small database, which Vercel provides for free at this scale via
Upstash Redis:

1. In your Vercel project, click the **Storage** tab (top nav of the project)
2. Click **Create Database** → choose **Upstash** → **Redis**
3. Give it any name, click through the defaults, and **Connect** it to this
   project when asked
4. That's it — Vercel automatically adds the right environment variables
   (`UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`) to your project.
   Redeploy (or it may redeploy automatically) and the app will start reading
   and writing to it.

Until this is set up, the app still loads and the checklist still works —
you'll just see a small note that the shared catalog/history couldn't be
reached, and any "Add item" or "Save to history" actions won't persist
across devices until the database is connected.

## What's new in this version

- **Visit date** — set the actual arrival date at the top of the page; it's
  attached to whatever gets saved to history.
- **Amenities & Maintenance** section — separate from the grocery
  trip-specific box, for anything that needs attention before arrival (AC,
  pool, a broken fixture, etc.).
- **Past visits** — a button in the top right of the hero opens a panel
  listing every previously submitted request (date, items, notes), pulled
  from the shared database so everyone sees the same history.
- **Save to history** — inside "Generate list," alongside Copy and Print,
  there's now a button that saves the current checked items + both notes
  sections as a permanent, shared record for that visit date.
- **Shared catalog** — adding a new item, or promoting a candidate (🆕) item
  to standing (★), now syncs to everyone instead of staying on one device.


## Where to make changes later

- `lib/masterList.ts` — the master item list itself (categories, standing vs.
  candidate status, default quantities, notes). Also used to seed the shared
  catalog the very first time the database is empty.
- `lib/kv.ts` — the shared server-side data layer (Upstash Redis): catalog and
  visit request history.
- `app/api/catalog/route.ts` / `app/api/requests/route.ts` — the two API
  routes the app talks to for shared data.
- `lib/useManifestState.ts` — client state: fetches the shared catalog,
  keeps the in-progress draft (checked items, quantities, notes, visit date)
  in this browser until submitted, and posts submissions to the API.
- `components/CategorySection.tsx` — one category block (checkbox, quantity,
  add-item row).
- `components/ExportPanel.tsx` — the "Generate list" popup: its formatting,
  Copy/Print, and the "Save to history" action.
- `components/HistoryPanel.tsx` — the "Past visits" panel.
- `app/page.tsx` — page layout, hero, visit date field, amenities section,
  and the sticky action bar at the bottom.

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

## Notes on this build

- The in-progress checklist (what's checked, quantities, both note fields,
  visit date) lives in this browser only until you hit "Save to history" —
  that's intentional, so two people prepping different future visits don't
  overwrite each other's in-progress work.
- Once saved, that visit's record — plus the catalog of items itself — is
  shared through Upstash Redis, so it's visible from any device.
- If you'd rather have real accounts/permissions (e.g. only Ben & Meredith
  can edit, but the house manager can only view), that's a further step up
  from this — worth a separate conversation if it becomes useful.
