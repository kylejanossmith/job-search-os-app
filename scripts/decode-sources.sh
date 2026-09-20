#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
mkdir -p src/components src/lib

# Prefer single gzip+base64 blobs when present; fall back to part*.txt
if [[ -f scripts/App.tsx.gz.b64 ]]; then
  base64 -d scripts/App.tsx.gz.b64 | gzip -d > src/App.tsx
  base64 -d scripts/Forms.tsx.gz.b64 | gzip -d > src/components/Forms.tsx
else
  cat scripts/b64/App.tsx/part*.txt | tr -d '\n' | base64 -d > src/App.tsx
  cat scripts/b64/Forms.tsx/part*.txt | tr -d '\n' | base64 -d > src/components/Forms.tsx
fi
echo "Decoded App.tsx ($(wc -c < src/App.tsx) bytes) and Forms.tsx ($(wc -c < src/components/Forms.tsx) bytes)"

# Optional large text restores (used when GitHub push size-limited)
if [[ -f scripts/styles.css.gz.b64 ]]; then
  base64 -d scripts/styles.css.gz.b64 | gzip -d > src/styles.css
  echo "Decoded styles.css ($(wc -c < src/styles.css) bytes)"
fi
if [[ -f scripts/README.md.gz.b64 ]]; then
  base64 -d scripts/README.md.gz.b64 | gzip -d > README.md
  echo "Decoded README.md ($(wc -c < README.md) bytes)"
fi
if [[ -f scripts/license.ts.gz.b64 ]]; then
  base64 -d scripts/license.ts.gz.b64 | gzip -d > src/lib/license.ts
  echo "Decoded license.ts ($(wc -c < src/lib/license.ts) bytes)"
fi
if [[ -f scripts/LicenseGate.tsx.gz.b64 ]]; then
  base64 -d scripts/LicenseGate.tsx.gz.b64 | gzip -d > src/components/LicenseGate.tsx
  echo "Decoded LicenseGate.tsx ($(wc -c < src/components/LicenseGate.tsx) bytes)"
fi
