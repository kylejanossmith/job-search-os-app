# SoloStack — Job Search OS (App)

Local-first job tracker: **Applications · Follow-ups · Interviews · Offers · Contacts**.

Dark navy SoloStack UI. Data stays on-device (`localStorage`) with JSON export/import.

| | |
| --- | --- |
| **Brand** | SoloStack |
| **Price** | NZ$15 on Gumroad |
| **Stack** | Vite + React + TypeScript · Electron · Capacitor |
| **Compliance** | Personal organizer only — no career/legal advice, no outcome guarantees |

## After cloning this repo

Full `src/App.tsx` + `src/components/Forms.tsx` ship as base64 parts (MCP size limits on push):

```bash
bash scripts/decode-sources.sh   # restores App.tsx + Forms.tsx
npm install
npm run dev
```

Complete working tree (decoded sources + built artifacts) is on the build box:

`/workspace/money-maker/apps/job-search-os/`

## Run from source

```bash
npm install
npm run dev                 # http://127.0.0.1:5173
npm run build               # → dist/web/
npm run electron:dev        # desktop shell
```

## Built artifacts (on the build box)

Exact paths after the 2026-09-20 (PT / Auckland) ship:

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
export JAVA_HOME=/opt/jdk-17
export ANDROID_HOME=$HOME/Android/Sdk
./scripts/setup-android.sh
npm run android:build
```

## iOS / .ipa

**Not built here.** Needs Apple Developer Program + macOS + Xcode. Stub: `ios-stub/README.md`.

## Compliance

See `COMPLIANCE.txt`. Sample data is fictional. Offer scores are subjective comparison aids only.

## License

UNLICENSED / proprietary SoloStack.
