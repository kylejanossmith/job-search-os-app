# Building Windows .exe

## Shipped from Linux (this release)

Because Wine is not available on the build box, the Windows artifact is the **unpacked Electron app**:

- `dist/SoloStack-Job-Search-OS-1.0.0-win-x64-unpacked.zip` — **run this** (extract, then run the `.exe`)

## Full portable .exe (single file) on a machine with Wine

```bash
# Debian/Ubuntu
sudo apt install wine64
npm ci
npm run electron:build:win
# → dist/desktop/SoloStack-Job-Search-OS-*-win-portable.exe
```

## GitHub Actions (recommended for signed/portable)

```yaml
name: Windows
on: [workflow_dispatch]
jobs:
  build:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run electron:build:win
      - uses: actions/upload-artifact@v4
        with:
          name: windows-portable
          path: dist/desktop/*.exe
```
