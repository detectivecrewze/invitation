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

function checkConfig() {
  if (!isKVConfigured()) {
    throw new Error(
      "Missing Cloudflare KV Configuration. Please set CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN, and KV_NAMESPACE_ID in your environment variables."
    );
  }
}

async function kvGet(key: string): Promise<unknown> {
  checkConfig();
  const res = await fetch(`${BASE()}/values/${encodeURIComponent(key)}`, {
    headers: cfHeaders(),
    cache: 'no-store',
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`KV GET failed: ${res.status} ${await res.text()}`);
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}

async function kvPut(key: string, value: unknown): Promise<void> {
  checkConfig();
  const body = typeof value === 'string' ? value : JSON.stringify(value);
  const res = await fetch(`${BASE()}/values/${encodeURIComponent(key)}`, {
    method: 'PUT',
    headers: cfHeaders(),
    body,
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`KV PUT failed: ${res.status} ${await res.text()}`);
}

async function kvDelete(key: string): Promise<void> {
  checkConfig();
  const res = await fetch(`${BASE()}/values/${encodeURIComponent(key)}`, {
    method: 'DELETE',
    headers: cfHeaders(),
  });
  if (!res.ok) throw new Error(`KV DELETE failed: ${res.status} ${await res.text()}`);
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
