#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

export JAVA_HOME="${JAVA_HOME:-/opt/jdk-17}"
export PATH="$JAVA_HOME/bin:$PATH"
SDK="${ANDROID_HOME:-$HOME/Android/Sdk}"
export ANDROID_HOME="$SDK"
export ANDROID_SDK_ROOT="$SDK"

mkdir -p "$SDK/cmdline-tools"
if [ ! -d "$SDK/cmdline-tools/latest" ]; then
  echo "==> Downloading Android cmdline-tools"
  cd /tmp
  curl -fsSL -o cmdtools.zip https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip
  rm -rf /tmp/cmdline-tools-extract
  mkdir -p /tmp/cmdline-tools-extract
  unzip -q cmdtools.zip -d /tmp/cmdline-tools-extract
  mkdir -p "$SDK/cmdline-tools"
  rm -rf "$SDK/cmdline-tools/latest"
  mv /tmp/cmdline-tools-extract/cmdline-tools "$SDK/cmdline-tools/latest"
fi

yes | "$SDK/cmdline-tools/latest/bin/sdkmanager" --sdk_root="$SDK" \
  "platform-tools" "platforms;android-34" "build-tools;34.0.0" || true

cd "$ROOT"
npm run build
if [ ! -d android ]; then
  npx cap add android
fi
npx cap sync android

# Accept licenses
yes | "$SDK/cmdline-tools/latest/bin/sdkmanager" --sdk_root="$SDK" --licenses >/dev/null || true

echo "sdk.dir=$SDK" > android/local.properties
echo "Android project ready."
