import fs from 'fs';
import path from 'path';

const BASE = () =>
  `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/${process.env.KV_NAMESPACE_ID}`;

const cfHeaders = () => ({
  Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
  'Content-Type': 'application/json',
});

export function isKVConfigured(): boolean {
  return !!(
    process.env.CLOUDFLARE_ACCOUNT_ID &&
    process.env.CLOUDFLARE_API_TOKEN &&
    process.env.KV_NAMESPACE_ID
  );
}

// ---------------------------------------------------------------------------
// Local Disk Storage Fallback (.data/local-db.json)
// ---------------------------------------------------------------------------
const LOCAL_DB_DIR = path.join(process.cwd(), '.data');
const LOCAL_DB_FILE = path.join(LOCAL_DB_DIR, 'local-db.json');

function getLocalDb(): Record<string, unknown> {
  try {
    if (!fs.existsSync(LOCAL_DB_DIR)) {
      fs.mkdirSync(LOCAL_DB_DIR, { recursive: true });
    }
    if (!fs.existsSync(LOCAL_DB_FILE)) {
      fs.writeFileSync(LOCAL_DB_FILE, JSON.stringify({}), 'utf-8');
      return {};
    }
    const content = fs.readFileSync(LOCAL_DB_FILE, 'utf-8');
    return JSON.parse(content || '{}');
  } catch {
    return {};
  }
}

function saveLocalDb(db: Record<string, unknown>) {
  try {
    if (!fs.existsSync(LOCAL_DB_DIR)) {
      fs.mkdirSync(LOCAL_DB_DIR, { recursive: true });
    }
    fs.writeFileSync(LOCAL_DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to write local DB fallback:', e);
  }
}

async function kvGet(key: string): Promise<unknown> {
  if (isKVConfigured()) {
    try {
      const res = await fetch(`${BASE()}/values/${encodeURIComponent(key)}`, {
        headers: cfHeaders(),
        cache: 'no-store',
      });
      if (res.status === 404) return null;
      if (res.ok) {
        const text = await res.text();
        try { return JSON.parse(text); } catch { return text; }
      }
    } catch (e) {
      console.warn(`[KV] Cloudflare KV fetch failed for ${key}, falling back to local storage:`, e);
    }
  }
  const db = getLocalDb();
  return db[key] ?? null;
}

async function kvPut(key: string, value: unknown): Promise<void> {
  if (isKVConfigured()) {
    try {
      const body = typeof value === 'string' ? value : JSON.stringify(value);
      const res = await fetch(`${BASE()}/values/${encodeURIComponent(key)}`, {
        method: 'PUT',
        headers: cfHeaders(),
        body,
        cache: 'no-store',
      });
      if (res.ok) return;
    } catch (e) {
      console.warn(`[KV] Cloudflare KV PUT failed for ${key}, saving locally:`, e);
    }
  }
  const db = getLocalDb();
  db[key] = value;
  saveLocalDb(db);
}

async function kvDelete(key: string): Promise<void> {
  if (isKVConfigured()) {
    try {
      const res = await fetch(`${BASE()}/values/${encodeURIComponent(key)}`, {
        method: 'DELETE',
        headers: cfHeaders(),
      });
      if (res.ok) return;
    } catch (e) {
      console.warn(`[KV] Cloudflare KV DELETE failed for ${key}, deleting locally:`, e);
    }
  }
  const db = getLocalDb();
  delete db[key];
  saveLocalDb(db);
}

// ---------------------------------------------------------------------------
// Invitation CRUD
// ---------------------------------------------------------------------------

export async function listInvitations(): Promise<string[]> {
  const index = await kvGet('inv:_index');
  return Array.isArray(index) ? (index as string[]) : [];
}

export async function getInvitation(id: string): Promise<unknown> {
  return kvGet(`inv:${id}`);
}

export async function putInvitation(id: string, data: unknown): Promise<void> {
  await kvPut(`inv:${id}`, data);
  const index = await listInvitations();
  if (!index.includes(id)) await kvPut('inv:_index', [...index, id]);
}

export async function deleteInvitation(id: string): Promise<void> {
  await kvDelete(`inv:${id}`);
  const index = await listInvitations();
  await kvPut('inv:_index', index.filter((x: string) => x !== id));
}

// ---------------------------------------------------------------------------
// Bundle Token CRUD
// ---------------------------------------------------------------------------

export interface BundleToken {
  id: string;
  remainingQuota: number;
  totalQuota: number;
  invitations: string[];
  createdAt: string;
  label?: string;
}

export async function listTokens(): Promise<string[]> {
  const index = await kvGet('token:_index');
  return Array.isArray(index) ? (index as string[]) : [];
}

export async function getToken(id: string): Promise<BundleToken | null> {
  const data = await kvGet(`token:${id}`);
  return data ? (data as BundleToken) : null;
}

export async function putToken(id: string, data: BundleToken): Promise<void> {
  await kvPut(`token:${id}`, data);
  const index = await listTokens();
  if (!index.includes(id)) await kvPut('token:_index', [...index, id]);
}

export async function deleteToken(id: string): Promise<void> {
  await kvDelete(`token:${id}`);
  const index = await listTokens();
  await kvPut('token:_index', index.filter((x: string) => x !== id));
}
