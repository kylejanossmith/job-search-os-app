import { FormEvent, ReactNode, useCallback, useEffect, useState } from 'react';
import {
  GUMROAD_BUY_URL,
  activateLicense,
  isActivatedLocally,
  isDevSkipLicense,
  softRecheckLicense,
} from '../lib/license';

type Props = { children: ReactNode };

/**
 * Full-screen Gumroad license gate until activated.
 * Offline: previously activated installs stay unlocked; never-activated require online verify once.
 */
export function LicenseGate({ children }: Props) {
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [key, setKey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      if (isDevSkipLicense()) {
        if (!cancelled) {
          setUnlocked(true);
          setReady(true);
        }
        return;
      }

      if (isActivatedLocally()) {
        if (!cancelled) {
          setUnlocked(true);
          setReady(true);
        }
        // Soft re-check in background when online
        void softRecheckLicense().then((r) => {
          if (cancelled) return;
          if (!r.stillValid) {
            setUnlocked(false);
            setError(r.error ?? 'License is no longer valid. Please activate again.');
          }
        });
        return;
      }

      if (!cancelled) {
        setUnlocked(false);
        setReady(true);
      }
    }

    void boot();
    return () => {
      cancelled = true;
    };
  }, []);

  const onSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setError(null);
      setBusy(true);
      try {
        const result = await activateLicense(key);
        if (result.ok) {
          setUnlocked(true);
        } else {
          setError(result.error);
        }
      } finally {
        setBusy(false);
      }
    },
    [key]
  );

  if (!ready) {
    return (
      <div className="license-gate" aria-busy="true">
        <div className="license-card license-card--loading">
          <p className="license-muted">Starting SoloStack…</p>
        </div>
      </div>
    );
  }

  if (unlocked) {
    return <>{children}</>;
  }

  return (
    <div className="license-gate">
      <div className="license-card">
        <div className="license-brand">
          <img src="./solostack-pfp.png" alt="" width={48} height={48} />
          <div>
            <h1>SoloStack</h1>
            <p>Job Search OS</p>
          </div>
        </div>

        <h2>Activate your license</h2>
        <p className="license-lead">
          Paste the license key from your Gumroad receipt to unlock this device.
          You only need to do this once — afterwards it works offline.
        </p>

        <form className="license-form" onSubmit={onSubmit}>
          <label htmlFor="license-key">License key</label>
          <input
            id="license-key"
            type="text"
            autoComplete="off"
            spellCheck={false}
            placeholder="XXXX-XXXX-XXXX-XXXX"
            value={key}
            onChange={(ev) => setKey(ev.target.value)}
            disabled={busy}
            autoFocus
          />
          {error ? (
            <p className="license-error" role="alert">
              {error}
            </p>
          ) : null}
          <button type="submit" className="license-btn" disabled={busy || !key.trim()}>
            {busy ? 'Verifying…' : 'Activate'}
          </button>
        </form>

        <p className="license-buy">
          Don&apos;t have a key?{' '}
          <a href={GUMROAD_BUY_URL} target="_blank" rel="noreferrer">
            Buy Job Search OS on Gumroad
          </a>
        </p>

        <p className="license-fine">
          Personal organizer only — no career/legal advice, no outcome guarantees.
        </p>
      </div>
    </div>
  );
}
