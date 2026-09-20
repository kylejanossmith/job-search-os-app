#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
export JAVA_HOME="${JAVA_HOME:-/opt/jdk-17}"
export PATH="$JAVA_HOME/bin:$PATH"
export ANDROID_HOME="${ANDROID_HOME:-$HOME/Android/Sdk}"
export ANDROID_SDK_ROOT="$ANDROID_HOME"

echo "==> npm build (web)"
npm run build

echo "==> Electron Linux AppImage"
npx electron-builder --linux AppImage --publish never || {
  echo "WARN: electron-builder AppImage failed"
}

# Copy AppImage to dist/
mkdir -p dist
find dist/desktop -name '*.AppImage' -exec cp -v {} dist/ \; 2>/dev/null || true

echo "==> Windows unpacked (dir target, no Wine)"
npx electron-builder --win dir --x64 --config electron-builder-win.json --publish never || {
  echo "WARN: Windows dir build failed"
}
if [ -d dist/desktop/win-unpacked ]; then
  python3 - <<'PY'
import zipfile, os
from pathlib import Path
src = Path("dist/desktop/win-unpacked")
out = Path("dist/SoloStack-Job-Search-OS-1.0.0-win-x64-unpacked.zip")
if out.exists(): out.unlink()
with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED, compresslevel=6) as zf:
    for root, dirs, files in os.walk(src):
        for f in files:
            p = Path(root) / f
            arc = Path("win-unpacked") / p.relative_to(src)
            zf.write(p, arc.as_posix())
print("Wrote", out)
PY
  echo "Wrote dist/SoloStack-Job-Search-OS-1.0.0-win-x64-unpacked.zip"
  cat > dist/WINDOWS-README.txt << 'W'
Windows build (cross-compiled from Linux without Wine)
======================================================
Extract SoloStack-Job-Search-OS-1.0.0-win-x64-unpacked.zip
Then run: win-unpacked/SoloStack Job Search OS.exe

For a single-file portable .exe, build on Windows or Linux+Wine:
  npm run electron:build:win
See BUILD-WINDOWS.md in the repo root.
W
fi

echo "==> Android debug APK"
if [ -d android ] && [ -x android/gradlew ]; then
  npx cap sync android || true
  (cd android && ./gradlew assembleDebug) || echo "WARN: gradle assembleDebug failed"
  APK="android/app/build/outputs/apk/debug/app-debug.apk"
  if [ -f "$APK" ]; then
    cp -v "$APK" dist/SoloStack-Job-Search-OS-debug.apk
  fi
else
  echo "WARN: android project missing — run scripts/setup-android.sh first"
fi

echo "==> Done. Artifacts:"
ls -lah dist/*.AppImage dist/*.apk dist/*.zip dist/WINDOWS-README.txt 2>/dev/null || ls -lah dist/ || true
