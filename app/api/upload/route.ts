import { NextRequest, NextResponse } from 'next/server';
import { MAX_AUDIO_UPLOAD_BYTES } from '@/lib/audio';

const MAX_IMAGE_UPLOAD_BYTES = 8 * 1024 * 1024;
const IMAGE_TYPES = new Map([
  ['image/jpeg', 'jpg'],
  ['image/jpg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
]);

function safeSegment(value: string, fallback: string): string {
  const cleaned = value
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
  return cleaned || fallback;
}

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

    const kind = String(formData.get('kind') || 'photo').toLowerCase();
    const invitationId = safeSegment(String(formData.get('invitationId') || ''), 'shared');
    let directory: 'photos' | 'audio';
    let ext: string;
    let contentType: string;

    if (kind === 'audio') {
      const isMp3 = file.type.toLowerCase() === 'audio/mpeg' || file.name.toLowerCase().endsWith('.mp3');
      if (!isMp3) {
        return NextResponse.json({ success: false, error: 'Audio harus berformat MP3.' }, { status: 415 });
      }
      if (file.size > MAX_AUDIO_UPLOAD_BYTES) {
        return NextResponse.json({ success: false, error: 'Ukuran MP3 maksimal 25 MB.' }, { status: 413 });
      }
      directory = 'audio';
      ext = 'mp3';
      contentType = 'audio/mpeg';
    } else if (kind === 'photo') {
      const imageExtension = IMAGE_TYPES.get(file.type.toLowerCase());
      if (!imageExtension) {
        return NextResponse.json({ success: false, error: 'Foto harus berformat JPG, PNG, atau WEBP.' }, { status: 415 });
      }
      if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
        return NextResponse.json({ success: false, error: 'Ukuran foto maksimal 8 MB.' }, { status: 413 });
      }
      directory = 'photos';
      ext = imageExtension;
      contentType = file.type.toLowerCase() === 'image/jpg' ? 'image/jpeg' : file.type.toLowerCase();
    } else {
      return NextResponse.json({ success: false, error: 'Jenis upload tidak didukung.' }, { status: 400 });
    }

    const { nanoid } = await import('nanoid');
    const filename = `invitation/${invitationId}/${directory}/${nanoid(12)}.${ext}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const url = await uploadToR2(buffer, filename, contentType);
    return NextResponse.json({ success: true, url });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Upload error:', err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
