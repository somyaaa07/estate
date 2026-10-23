import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export const runtime = 'nodejs';

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

// Real type from the first bytes (JPG, PNG, WEBP only)
function detectImageType(buf) {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'jpg';
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return 'png';
  if (
    buf.slice(0, 4).toString('ascii') === 'RIFF' &&
    buf.slice(8, 12).toString('ascii') === 'WEBP'
  ) {
    return 'webp';
  }
  return null;
}

export async function POST(req) {
  // Public route (no login) -> strict limits instead
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'Invalid file' }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large. Max 5MB' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const ext = detectImageType(buffer);
    if (!ext) {
      return NextResponse.json({ error: 'Only JPG, PNG or WEBP allowed' }, { status: 400 });
    }

    // Random name: visitors cannot choose or overwrite file names
    const filename = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${ext}`;

    // Separate folder from admin uploads
    const dir = path.join(process.cwd(), 'public', 'uploads', 'sell');
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, filename), buffer);

    return NextResponse.json({ url: `/uploads/sell/${filename}` });
  } catch (err) {
    console.error('upload-public error:', err);
    return NextResponse.json({ error: 'Upload failed. Try again.' }, { status: 500 });
  }
}