import { NextRequest, NextResponse } from 'next/server';
import { listTokens, getToken, putToken, deleteToken, BundleToken } from '@/lib/kv';
import { nanoid } from 'nanoid';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (id) {
    const token = await getToken(id.toUpperCase());
    if (!token) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(token);
  }

  const ids = await listTokens();
  const tokens = await Promise.all(ids.map(id => getToken(id)));
  return NextResponse.json({ tokens: tokens.filter(Boolean) });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { quota, label } = body;

  // Generate a human-friendly token ID using an unambiguous character set
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const raw = nanoid(8);
  const id = raw.split('').map(c => chars[c.charCodeAt(0) % chars.length]).join('');

  const token: BundleToken = {
    id,
    remainingQuota: quota ?? 1,
    totalQuota: quota ?? 1,
    invitations: [],
    createdAt: new Date().toISOString(),
    label,
  };

  await putToken(id, token);
  return NextResponse.json({ success: true, token });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await deleteToken(id);
  return NextResponse.json({ success: true });
}
