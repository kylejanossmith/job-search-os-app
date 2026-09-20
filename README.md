# SoloStack — Job Search OS (App)

Local-first job tracker: **Applications · Follow-ups · Interviews · Offers · Contacts**.

Dark navy SoloStack UI. Data stays on-device (`localStorage`) with JSON export/import.

| | |
| --- | --- |
| **Brand** | SoloStack |
| **Price** | NZ$15 on Gumroad |
| **Stack** | Vite + React + TypeScript · Electron · Capacitor |
| **Compliance** | Personal organizer only — no career/legal advice, no outcome guarantees |



## License activation (Gumroad)

On first launch the app shows a full-screen activation screen. Paste the **license key** from your Gumroad receipt and tap **Activate**. After a successful verify, the key is stored locally (`localStorage`) and the app works **offline**.

| | |
| --- | --- |
| **Product permalink** | `aijqck` |
| **Buy link** | https://kylejanos.gumroad.com/l/aijqck |
| **Verify API** | `POST https://api.gumroad.com/v2/licenses/verify` (public — no access token in the client) |

### Seller checklist (Kyle)

1. In Gumroad → Products → Job Search OS → enable **"Generate a unique license key per sale"**.
2. Copy the product **id** (not just the permalink) into `.env` as `VITE_GUMROAD_PRODUCT_ID=…` before production builds. Products created on/after **9 Jan 2023** often require `product_id` in addition to `product_permalink`. See `.env.example`.
3. Rebuild after setting the env var so Vite bakes it into the client bundle.

### How verification works

- **First activate:** sends `product_permalink=aijqck`, `license_key`, optional `product_id`, and `increment_uses_count=true`. Rejects refunded / chargebacked / disputed purchases. Caps activations around **5 devices** via Gumroad `uses`.
- **Later launches:** if a local activation exists, unlock immediately (works offline). When online, soft-recheck about weekly with `increment_uses_count=false`. Network errors soft-fail if already activated.
- **Never activated + offline:** stays locked until an online verify succeeds once.
- **Dev bypass:** `VITE_DEV_SKIP_LICENSE=1` (documented here; **never** set in production builds).

## After cloning this repo

Full `src/App.tsx` + `src/components/Forms.tsx` may ship as base64 parts (tool size limits):

```bash
bash scripts/decode-sources.sh   # restores App.tsx + Forms.tsx (+ styles/README if blobs present)
npm install
npm run dev
```

Complete working tree (including decoded sources + built artifacts) is on the build box:

`/workspace/money-maker/apps/job-search-os/`

## Run from source

```bash
npm install
npm run dev                 # http://127.0.0.1:5173
npm run build               # → dist/web/
npm run electron:dev        # desktop shell
```

## Built artifacts (on the build box)

Exact paths after the latest ship (license gate included):

| Platform | Path | Notes |
| --- | --- | --- |
| **Linux AppImage** | `/workspace/money-maker/apps/job-search-os/dist/SoloStack-Job-Search-OS-1.0.0-linux-x86_64.AppImage` | Runnable tonight (`chmod +x` then run) |
| **Windows** | `/workspace/money-maker/apps/job-search-os/dist/SoloStack-Job-Search-OS-1.0.0-win-x64-unpacked.zip` | Extract → run `SoloStack Job Search OS.exe` |
| **Android APK** | `/workspace/money-maker/apps/job-search-os/dist/SoloStack-Job-Search-OS-debug.apk` | Unsigned debug APK (sideload OK) |
| **Windows note** | `dist/WINDOWS-README.txt` + `BUILD-WINDOWS.md` | Single-file portable needs Wine or Windows CI |

Web build: `dist/web/`

> Large binaries are **not** committed to GitHub (size limits). They live under `dist/` on the box. Rebuild with `scripts/build-all.sh`.

## Features

- **Applications** — Kanban + table; next-action + date (source of truth)
- **Follow-ups** — Due / overdue cadence
- **Interviews** — Prep status + STAR notes
- **Offers** — Comp fields + scores **Base / Bonus / Remote / Growth** (weighted 35/20/20/25)
- **Contacts** — Warm/cold CRM
- **Dashboard** — Open apps, due follow-ups, upcoming interviews, pending offers

## Desktop (Electron)

```bash
npm run electron:build         # Linux AppImage → dist/desktop/
npm run electron:build:win     # Portable .exe (requires Wine on Linux)
```

See `BUILD-WINDOWS.md` for cross-compile / GitHub Actions.

## Android (Capacitor)

```bash
export JAVA_HOME=/opt/jdk-17          # or your JDK 17+
export ANDROID_HOME=$HOME/Android/Sdk
./scripts/setup-android.sh            # once
npm run android:build
# APK: android/app/build/outputs/apk/debug/app-debug.apk
```

## iOS / .ipa

**Not built here.** Needs Apple Developer Program + macOS + Xcode. Stub: `ios-stub/README.md`.

```bash
# On a Mac:
npx cap add ios && npx cap sync ios && npx cap open ios
```

## Compliance

See `COMPLIANCE.txt`. Sample companies/contacts are fictional. Offer scores are subjective comparison aids only — not financial advice.

## Schema

Implements the five DBs from SoloStack Job Search OS product schema (`SCHEMA.md` in the product pack): Applications, Follow-ups, Interviews, Offers, Contacts.

## Scripts

| Script | Purpose |
| --- | --- |
| `scripts/setup-android.sh` | JDK/SDK + `cap add android` |
| `scripts/build-all.sh` | Web + AppImage + APK (+ Windows attempt) |
| `scripts/decode-sources.sh` | Restore App/Forms/styles/README from gzip+b64 blobs |

## License

UNLICENSED / proprietary SoloStack. Customers may customize for personal job-search use.
