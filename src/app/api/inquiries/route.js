import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, getAdminEmails } from '@/lib/auth';
import dbInit, { Inquiry, Property } from '@/lib/dbInit';
import { sendInquiryEmail } from '@/lib/mailer';

// POST — koi bhi (guest/user) inquiry bhej sakta hai.
// Inquiry DB mein save hoti hai (admin dashboard ke Inquiries section mein dikhti hai)
// aur saare admins ke email par mail jaati hai.
export async function POST(req) {
  await dbInit();

  try {
    const body = await req.json();
    const { property_id, name, email, phone, message } = body;

    if (!property_id || !name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'Property ID, name, email and message are required.' },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    const user_id = session?.user?.id || null;

    const property = await Property.findByPk(property_id);
    if (!property) {
      return NextResponse.json({ error: 'Property not found.' }, { status: 404 });
    }

    const inquiry = await Inquiry.create({
      property_id,
      user_id,
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || null,
      message: message.trim(),
    });

    // ── Email → admin(s) ──
    try {
      const adminEmails = await getAdminEmails();
      if (adminEmails.length > 0) {
        await sendInquiryEmail({
          to: adminEmails,
          property,
          inquiry: { name: name.trim(), email: email.trim(), phone: phone?.trim(), message: message.trim() },
        });
        console.log('✅ Inquiry mail gaya:', adminEmails.join(', '));
      }
    } catch (e) {
      // Mail fail ho to bhi inquiry save hai — admin dashboard mein dikhegi
      console.error('⚠️ Admin email failed:', e.message);
    }

    return NextResponse.json(
      { success: true, inquiry_id: inquiry.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Inquiry error:', error);
    return NextResponse.json({ error: 'Could not send inquiry.' }, { status: 500 });
  }
}
