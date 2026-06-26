import { NextRequest, NextResponse } from 'next/server';
import { getInvitation, putInvitation, listInvitations } from '@/lib/kv';
import { nanoid } from 'nanoid';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (id) {
    const data = await getInvitation(id);
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(data);
  }

  const ids = await listInvitations();
  return NextResponse.json({ ids });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const invitationId = body.invitationId || nanoid(10);

  // Token validation
  if (body.bundleToken) {
    const { getToken, putToken } = await import('@/lib/kv');
    const token = await getToken(body.bundleToken.toUpperCase());
    if (!token) return NextResponse.json({ error: 'Invalid token' }, { status: 403 });

    const existing = await getInvitation(invitationId);
    if (!existing) {
      if (token.remainingQuota <= 0) return NextResponse.json({ error: 'Token exhausted' }, { status: 403 });
      await putToken(token.id, {
        ...token,
        remainingQuota: token.remainingQuota - 1,
        invitations: [...(token.invitations || []), invitationId],
      });
    } else {
      if (!token.invitations?.includes(invitationId)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
    }
  }

  // Strip internal fields before storing
  const { invitationId: _id, bundleToken: _bt, ...data } = body;
  await putInvitation(invitationId, {
    ...data,
    invitationId,
    updatedAt: new Date().toISOString(),
  });

  return NextResponse.json({ success: true, invitationId });
}
