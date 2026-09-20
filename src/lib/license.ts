/**
 * Gumroad license verification for SoloStack Job Search OS.
 * Public verify endpoint only — never ship access tokens in the client.
 *
 * Products created on/after 2023-01-09 often require product_id in addition
 * to product_permalink. Send both when VITE_GUMROAD_PRODUCT_ID is set.
 */

export const PRODUCT_PERMALINK = 'aijqck';
export const GUMROAD_BUY_URL = 'https://kylejanos.gumroad.com/l/aijqck';
export const LICENSE_STORAGE_KEY = 'solostack-jso-license-v1';
export const MAX_DEVICE_USES = 5;
/** Soft re-check interval when online (ms). */
export const RECHECK_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export type ActivationRecord = {
  licenseKey: string;
  activatedAt: string;
  lastVerifiedAt: string;
  email?: string;
  uses?: number;
};

export type VerifyResult =
  | { ok: true; record: ActivationRecord }
  | { ok: false; error: string; needsProductId?: boolean };

type GumroadPurchase = {
  email?: string;
  refunded?: boolean;
  disputed?: boolean;
  chargebacked?: boolean;
  [key: string]: unknown;
};

type GumroadVerifyResponse = {
  success?: boolean;
  message?: string;
  uses?: number;
  purchase?: GumroadPurchase;
};

function productIdFromEnv(): string | undefined {
  const id = import.meta.env.VITE_GUMROAD_PRODUCT_ID;
  return typeof id === 'string' && id.trim() ? id.trim() : undefined;
}

export function isDevSkipLicense(): boolean {
  return import.meta.env.VITE_DEV_SKIP_LICENSE === '1';
}

export function loadActivation(): ActivationRecord | null {
  try {
    const raw = localStorage.getItem(LICENSE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ActivationRecord;
    if (!parsed?.licenseKey || !parsed?.activatedAt) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveActivation(record: ActivationRecord): void {
  localStorage.setItem(LICENSE_STORAGE_KEY, JSON.stringify(record));
}

export function clearActivation(): void {
  localStorage.removeItem(LICENSE_STORAGE_KEY);
}

export function isActivatedLocally(): boolean {
  if (isDevSkipLicense()) return true;
  return loadActivation() !== null;
}

async function postVerify(
  licenseKey: string,
  incrementUses: boolean,
  includeProductId: boolean
): Promise<{ status: number; body: GumroadVerifyResponse; rawText: string }> {
  const params = new URLSearchParams();
  params.set('product_permalink', PRODUCT_PERMALINK);
  params.set('license_key', licenseKey.trim());
  params.set('increment_uses_count', incrementUses ? 'true' : 'false');
  const productId = productIdFromEnv();
  if (includeProductId && productId) {
    params.set('product_id', productId);
  }

  const res = await fetch('https://api.gumroad.com/v2/licenses/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });
  const rawText = await res.text();
  let body: GumroadVerifyResponse = {};
  try {
    body = JSON.parse(rawText) as GumroadVerifyResponse;
  } catch {
    /* non-JSON */
  }
  return { status: res.status, body, rawText };
}

function messageNeedsProductId(msg: string | undefined, raw: string): boolean {
  const hay = `${msg ?? ''} ${raw}`.toLowerCase();
  return (
    hay.includes('product_id') ||
    hay.includes('product id') ||
    hay.includes('created after') ||
    hay.includes('on or after january 9')
  );
}

function evaluatePurchase(
  licenseKey: string,
  body: GumroadVerifyResponse,
  previous?: ActivationRecord | null
): VerifyResult {
  if (!body.success) {
    const msg = body.message || 'License key could not be verified.';
    return { ok: false, error: msg };
  }

  const purchase = body.purchase;
  if (!purchase) {
    return { ok: false, error: 'Invalid response from license server.' };
  }

  if (purchase.refunded) {
    return { ok: false, error: 'This purchase was refunded. Activation is not available.' };
  }
  if (purchase.chargebacked) {
    return { ok: false, error: 'This purchase was chargebacked. Activation is not available.' };
  }
  if (purchase.disputed) {
    return { ok: false, error: 'This purchase is disputed. Activation is not available.' };
  }

  const uses = typeof body.uses === 'number' ? body.uses : undefined;
  if (uses !== undefined && uses > MAX_DEVICE_USES) {
    return {
      ok: false,
      error: `This license has been activated on too many devices (limit ${MAX_DEVICE_USES}). Contact support if you need a reset.`,
    };
  }

  const now = new Date().toISOString();
  const record: ActivationRecord = {
    licenseKey: licenseKey.trim(),
    activatedAt: previous?.activatedAt ?? now,
    lastVerifiedAt: now,
    email: typeof purchase.email === 'string' ? purchase.email : previous?.email,
    uses,
  };
  return { ok: true, record };
}

/**
 * First-time (or re-) activation. Increments Gumroad uses count.
 */
export async function activateLicense(licenseKey: string): Promise<VerifyResult> {
  const key = licenseKey.trim();
  if (!key) {
    return { ok: false, error: 'Paste your Gumroad license key to continue.' };
  }

  const productId = productIdFromEnv();
  // Prefer both permalink + product_id when available
  try {
    let { status, body, rawText } = await postVerify(key, true, Boolean(productId));

    if (
      !body.success &&
      !productId &&
      messageNeedsProductId(body.message, rawText)
    ) {
      return {
        ok: false,
        error:
          'Gumroad requires a product_id for this listing. Set VITE_GUMROAD_PRODUCT_ID in .env (see .env.example) and rebuild.',
        needsProductId: true,
      };
    }

    // If we sent product_id and still failed with a permalink-only hint, retry permalink alone once
    if (!body.success && productId && status >= 400) {
      const retry = await postVerify(key, true, false);
      if (retry.body.success) {
        body = retry.body;
        rawText = retry.rawText;
      }
    }

    const result = evaluatePurchase(key, body, null);
    if (result.ok) {
      saveActivation(result.record);
    }
    return result;
  } catch (e) {
    const offline = typeof navigator !== 'undefined' && navigator.onLine === false;
    return {
      ok: false,
      error: offline
        ? 'You need an internet connection to activate for the first time.'
        : 'Could not reach Gumroad. Check your connection and try again.',
    };
  }
}

/**
 * Soft re-check for an already-activated install. Does not increment uses.
 * Soft-fails (keeps unlocked) when offline or network errors.
 */
export async function softRecheckLicense(): Promise<{
  stillValid: boolean;
  offlineSoftFail: boolean;
  error?: string;
}> {
  if (isDevSkipLicense()) {
    return { stillValid: true, offlineSoftFail: false };
  }

  const existing = loadActivation();
  if (!existing) {
    return { stillValid: false, offlineSoftFail: false, error: 'Not activated.' };
  }

  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return { stillValid: true, offlineSoftFail: true };
  }

  const last = Date.parse(existing.lastVerifiedAt || '');
  if (Number.isFinite(last) && Date.now() - last < RECHECK_INTERVAL_MS) {
    return { stillValid: true, offlineSoftFail: false };
  }

  try {
    const productId = productIdFromEnv();
    let { body, rawText } = await postVerify(existing.licenseKey, false, Boolean(productId));

    if (!body.success && !productId && messageNeedsProductId(body.message, rawText)) {
      // Soft-fail: keep unlocked but surface that product_id should be configured for future checks
      return {
        stillValid: true,
        offlineSoftFail: false,
        error: 'Recheck skipped: product_id not configured (see .env.example).',
      };
    }

    const result = evaluatePurchase(existing.licenseKey, body, existing);
    if (result.ok) {
      saveActivation(result.record);
      return { stillValid: true, offlineSoftFail: false };
    }

    // Hard revoke only when Gumroad clearly says refunded/chargeback/dispute/disabled
    const hard =
      /refund|chargeback|disput|disabled|invalid|not.?found|revok/i.test(result.error);
    if (hard) {
      clearActivation();
      return { stillValid: false, offlineSoftFail: false, error: result.error };
    }

    // Ambiguous API failure — soft-fail
    return { stillValid: true, offlineSoftFail: false, error: result.error };
  } catch {
    return { stillValid: true, offlineSoftFail: true };
  }
}
