import { readFile } from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const TYPES = {
  jpg: 'image/jpeg', jpeg: 'image/jpeg',
  png: 'image/png', webp: 'image/webp', gif: 'image/gif',
};

export async function GET(req, { params }) {
  const { path: segs } = await params;
  const base = path.join(process.cwd(), 'public', 'uploads');
  const full = path.join(base, ...segs);

  // path traversal se bachne ke liye
  if (!full.startsWith(base + path.sep)) {
    return new NextResponse('Not found', { status: 404 });
  }

  try {
    const buf = await readFile(full);
    const ext = path.extname(full).slice(1).toLowerCase();
    return new NextResponse(buf, {
      headers: {
        'Content-Type': TYPES[ext] || 'application/octet-stream',
        'Cache-Control': 'public, max-age=2592000',
      },
    });
  } catch {
    return new NextResponse('Not found', { status: 404 });
  }
}