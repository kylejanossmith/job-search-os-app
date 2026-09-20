import { SEED } from '../data/seed';
import type {
  Application,
  Contact,
  FollowUp,
  Interview,
  Offer,
  StoreData,
} from './types';

const KEY = 'solostack-job-search-os-v1';

function load(): StoreData {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as StoreData;
  } catch {
    /* ignore */
  }
  return structuredClone(SEED);
}

function save(data: StoreData) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

let cache = load();
const listeners = new Set<() => void>();

function emit() {
  save(cache);
  listeners.forEach((l) => l());
}

export function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function getStore(): StoreData {
  return cache;
}

export function resetToSeed() {
  cache = structuredClone(SEED);
  emit();
}

export function exportJson(): string {
  return JSON.stringify(cache, null, 2);
}

export function importJson(text: string) {
  const parsed = JSON.parse(text) as StoreData;
  if (!parsed.applications || !parsed.counters) throw new Error('Invalid backup');
  cache = parsed;
  emit();
}

function nextId(prefix: string, n: number) {
  return `${prefix}-${String(n).padStart(3, '0')}`;
}

export function addApplication(partial: Omit<Application, 'id'>) {
  cache.counters.app += 1;
  const row: Application = { ...partial, id: nextId('APP', cache.counters.app) };
  cache.applications = [row, ...cache.applications];
  emit();
  return row;
}

export function updateApplication(id: string, patch: Partial<Application>) {
  cache.applications = cache.applications.map((a) =>
    a.id === id ? { ...a, ...patch, id } : a
  );
  emit();
}

export function deleteApplication(id: string) {
  cache.applications = cache.applications.filter((a) => a.id !== id);
  emit();
}

export function addFollowUp(partial: Omit<FollowUp, 'id'>) {
  cache.counters.fu += 1;
  const row: FollowUp = { ...partial, id: nextId('FU', cache.counters.fu) };
  cache.followUps = [row, ...cache.followUps];
  emit();
  return row;
}

export function updateFollowUp(id: string, patch: Partial<FollowUp>) {
  cache.followUps = cache.followUps.map((a) =>
    a.id === id ? { ...a, ...patch, id } : a
  );
  emit();
}

export function deleteFollowUp(id: string) {
  cache.followUps = cache.followUps.filter((a) => a.id !== id);
  emit();
}

export function addInterview(partial: Omit<Interview, 'id'>) {
  cache.counters.int += 1;
  const row: Interview = { ...partial, id: nextId('INT', cache.counters.int) };
  cache.interviews = [row, ...cache.interviews];
  emit();
  return row;
}

export function updateInterview(id: string, patch: Partial<Interview>) {
  cache.interviews = cache.interviews.map((a) =>
    a.id === id ? { ...a, ...patch, id } : a
  );
  emit();
}

export function deleteInterview(id: string) {
  cache.interviews = cache.interviews.filter((a) => a.id !== id);
  emit();
}

export function addOffer(partial: Omit<Offer, 'id'>) {
  cache.counters.off += 1;
  const row: Offer = { ...partial, id: nextId('OFF', cache.counters.off) };
  cache.offers = [row, ...cache.offers];
  emit();
  return row;
}

export function updateOffer(id: string, patch: Partial<Offer>) {
  cache.offers = cache.offers.map((a) =>
    a.id === id ? { ...a, ...patch, id } : a
  );
  emit();
}

export function deleteOffer(id: string) {
  cache.offers = cache.offers.filter((a) => a.id !== id);
  emit();
}

export function addContact(partial: Omit<Contact, 'id'>) {
  cache.counters.con += 1;
  const row: Contact = { ...partial, id: nextId('CON', cache.counters.con) };
  cache.contacts = [row, ...cache.contacts];
  emit();
  return row;
}

export function updateContact(id: string, patch: Partial<Contact>) {
  cache.contacts = cache.contacts.map((a) =>
    a.id === id ? { ...a, ...patch, id } : a
  );
  emit();
}

export function deleteContact(id: string) {
  cache.contacts = cache.contacts.filter((a) => a.id !== id);
  emit();
}

/** Weighted offer score: base 35%, bonus 20%, remote 20%, growth 25% */
export function offerTotalScore(o: Offer): number {
  const t =
    o.scoreBase * 0.35 +
    o.scoreBonus * 0.2 +
    o.scoreRemote * 0.2 +
    o.scoreGrowth * 0.25;
  return Math.round(t * 10) / 10;
}
