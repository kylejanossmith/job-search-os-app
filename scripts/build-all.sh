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

echo "==> Android debug APK"
if [ -d android ] && [ -x android/gradlew ]; then
  (cd android && ./gradlew assembleDebug) || echo "WARN: gradle assembleDebug failed"
  APK="android/app/build/outputs/apk/debug/app-debug.apk"
  if [ -f "$APK" ]; then
    cp -v "$APK" dist/SoloStack-Job-Search-OS-debug.apk
  fi
else
  echo "WARN: android project missing — run scripts/setup-android.sh first"
fi

echo "==> Try Windows portable (may need Wine)"
npx electron-builder --win portable --x64 --publish never || {
  echo "WARN: Windows build failed (expected without Wine). Documented in README."
}
find dist/desktop -name '*.exe' -exec cp -v {} dist/ \; 2>/dev/null || true

echo "==> Done. Artifacts:"
ls -lah dist/ || true
