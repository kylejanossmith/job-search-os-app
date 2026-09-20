#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
mkdir -p src/components
# Prefer single gzip+base64 blobs when present; fall back to part*.txt
if [[ -f scripts/App.tsx.gz.b64 ]]; then
  base64 -d scripts/App.tsx.gz.b64 | gzip -d > src/App.tsx
  base64 -d scripts/Forms.tsx.gz.b64 | gzip -d > src/components/Forms.tsx
else
  cat scripts/b64/App.tsx/part*.txt | tr -d '\n' | base64 -d > src/App.tsx
  cat scripts/b64/Forms.tsx/part*.txt | tr -d '\n' | base64 -d > src/components/Forms.tsx
fi
echo "Decoded App.tsx ($(wc -c < src/App.tsx) bytes) and Forms.tsx ($(wc -c < src/components/Forms.tsx) bytes)"
