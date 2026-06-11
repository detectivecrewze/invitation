import { NextRequest, NextResponse } from 'next/server';

function isR2Configured(): boolean {
  return !!(
    process.env.CLOUDFLARE_ACCOUNT_ID &&
    process.env.CLOUDFLARE_API_TOKEN &&
    process.env.R2_BUCKET_NAME &&
    process.env.R2_PUBLIC_URL
  );
}

async function uploadToR2(buffer: Buffer, filename: string, contentType: string): Promise<string> {
  if (!isR2Configured()) {
    throw new Error(
      "Missing Cloudflare R2 Configuration. Please set CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN, R2_BUCKET_NAME, and R2_PUBLIC_URL."
    );
  }

  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID!;
  const bucketName = process.env.R2_BUCKET_NAME!;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN!;
  const publicUrl = process.env.R2_PUBLIC_URL!.replace(/\/$/, "");

  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/r2/buckets/${bucketName}/objects/${encodeURIComponent(filename)}`;

  const uploadRes = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${apiToken}`,
      'Content-Type': contentType,
    },
    body: new Uint8Array(buffer),
  });

  if (!uploadRes.ok) {
    const txt = await uploadRes.text();
    throw new Error(`R2 upload failed: ${uploadRes.status} ${txt}`);
  }

  return `${publicUrl}/${filename}`;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) return NextResponse.json({ success: false, error: 'No file' }, { status: 400 });

    const ext = file.name.split('.').pop() ?? 'bin';
    const { nanoid } = await import('nanoid');
    const filename = `${nanoid(12)}.${ext}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const url = await uploadToR2(buffer, filename, file.type);
    return NextResponse.json({ success: true, url });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Upload error:', err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
