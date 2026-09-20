# iOS / .ipa — not built on Linux

Producing a distributable `.ipa` requires:

1. Apple Developer Program membership
2. macOS with Xcode
3. Capacitor iOS platform

```bash
npm install
npm run build
npx cap add ios
npx cap sync ios
npx cap open ios
# Product → Archive → Distribute App
```

This folder is a stub placeholder so the monorepo documents the path.
