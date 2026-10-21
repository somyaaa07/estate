import { NextResponse } from 'next/server';
import { sendSellPropertyEmail } from '@/lib/mailer'; 

export async function POST(req) {
  try {
    const form = await req.json();

    // Honeypot: bots fill this, humans don't. Pretend success.
    if (form.website) return NextResponse.json({ ok: true });

    // Server-side validation (never trust the client)
    const phoneOk = String(form.phone || '').replace(/\D/g, '').length >= 10;
    const emailOk = /^\S+@\S+\.\S+$/.test(String(form.email || '').trim());
    if (
      !form.name?.trim() || !phoneOk || !emailOk ||
      !form.title?.trim() || !(Number(form.price) > 0) ||
      !form.location?.trim() || !form.city?.trim() ||
      !Array.isArray(form.images) || form.images.length === 0
    ) {
      return NextResponse.json({ error: 'Please fill all required fields.' }, { status: 400 });
    }

    await sendSellPropertyEmail({ form });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('sell-property error:', err);
    return NextResponse.json(
      { error: 'Could not submit right now. Please try again.' },
      { status: 500 }
    );
  }
}