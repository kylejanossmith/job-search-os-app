#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
mkdir -p src/components
cat scripts/b64/App.tsx/part*.txt | tr -d '\n' | base64 -d > src/App.tsx
cat scripts/b64/Forms.tsx/part*.txt | tr -d '\n' | base64 -d > src/components/Forms.tsx
echo "Decoded App.tsx ($(wc -c < src/App.tsx) bytes) and Forms.tsx ($(wc -c < src/components/Forms.tsx) bytes)"
