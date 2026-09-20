// Full UI: run `bash scripts/decode-sources.sh` after clone (restores App.tsx + Forms.tsx from scripts/b64).
// Complete sources also live on the build box: /workspace/money-maker/apps/job-search-os/src/
import { useState } from 'react';

export default function App() {
  const [ok] = useState(true);
  return (
    <div style={{ padding: 24, fontFamily: 'system-ui', background: '#0B1220', color: '#E8EEF8', minHeight: '100vh' }}>
      <h1>SoloStack — Job Search OS</h1>
      <p>Stub build. Restore full app:</p>
      <pre style={{ background: '#162033', padding: 12, borderRadius: 8 }}>bash scripts/decode-sources.sh && npm install && npm run dev</pre>
      <p style={{ color: '#8B9BB4', fontSize: 13 }}>
        Personal organizer only · no guarantees · NZ$15 on Gumroad · {ok ? 'ready' : ''}
      </p>
    </div>
  );
}
