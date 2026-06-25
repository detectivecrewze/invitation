import { NextRequest, NextResponse } from "next/server";
import { putToken, putInvitation, BundleToken, getToken } from "@/lib/kv";
import { nanoid } from "nanoid";

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';

function generateInvitationId(): string {
  // Friendly ID mirip contoh: WRcVb-mY0f
  const part1 = Array.from({ length: 5 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join('');
  const part2 = Array.from({ length: 4 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join('');
  return `${part1}-${part2}`;
}

function generateTokenId(): string {
  const raw = nanoid(8);
  return raw.split('').map(c => CHARS[c.charCodeAt(0) % CHARS.length]).join('').toUpperCase();
}

export async function POST(req: NextRequest) {
  // 1. Verifikasi GENERATOR_SECRET
  const authHeader = req.headers.get('Authorization');
  const secret = "digitalatelier2025";
  if (!authHeader || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    // quota dari request body — default ke 3 (bundle) kalau tidak disertakan
    const quota: number = typeof body.quota === 'number' ? body.quota : 3;
    const domainUrl = "https://invitation.for-you-always.my.id";

    // ── Mode Satuan (quota === 1) ────────────────────────────────────────────
    // Buat entry invitation kosong dengan ID random, kembalikan studioUrl langsung
    if (quota === 1) {
      const invitationId = generateInvitationId();

      await putInvitation(invitationId, {
        invitationId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        source: "payment-gateway",
      });

      const studioUrl = `${domainUrl}/studio/${invitationId}`;

      return NextResponse.json({
        success: true,
        studioUrl,
        message: 'Invitation satuan berhasil dibuat',
      }, { headers: CORS_HEADERS });
    }

    // ── Mode Bundle (quota >= 2) ─────────────────────────────────────────────
    // Buat bundle token dengan kuota yang diminta
    let id = generateTokenId();
    let attempts = 0;
    while ((await getToken(id)) !== null && attempts < 10) {
      id = generateTokenId();
      attempts++;
    }

    const token: BundleToken = {
      id,
      remainingQuota: quota,
      totalQuota: quota,
      invitations: [],
      createdAt: new Date().toISOString(),
      label: "Payment Gateway",
    };

    await putToken(id, token);

    return NextResponse.json({
      success: true,
      token: id,
      url: domainUrl,
      message: 'Token berhasil dibuat',
    }, { headers: CORS_HEADERS });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { headers: CORS_HEADERS });
}
