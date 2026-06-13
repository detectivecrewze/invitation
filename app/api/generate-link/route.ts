import { NextRequest, NextResponse } from "next/server";
import { putToken, BundleToken, getToken } from "@/lib/kv";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  // 1. Verifikasi GENERATOR_SECRET
  const authHeader = req.headers.get('Authorization');
  const secret = "digitalatelier2025";
  if (!authHeader || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const quota = 3;

    // Generate a human-friendly token ID using an unambiguous character set
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let id = "";
    let attempts = 0;
    
    do {
      const raw = nanoid(8);
      id = raw.split('').map(c => chars[c.charCodeAt(0) % chars.length]).join('');
      attempts++;
    } while ((await getToken(id)) !== null && attempts < 10);

    const token: BundleToken = {
      id,
      remainingQuota: quota,
      totalQuota: quota,
      invitations: [],
      createdAt: new Date().toISOString(),
      label: "Midtrans Purchase",
    };

    await putToken(id, token);

    const domainUrl = "https://invitation.for-you-always.my.id";

    return NextResponse.json({
      success: true,
      token: id,
      url: domainUrl,
      message: 'Token berhasil dibuat'
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
