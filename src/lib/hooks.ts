import { useEffect, useState } from 'react';
import { getStore, subscribe } from './store';
import type { StoreData } from './types';

export function useStore(): StoreData {
  const [data, setData] = useState(getStore);
  useEffect(() => subscribe(() => setData(getStore())), []);
  return data;
}

export function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
