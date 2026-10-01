<<<<<<< HEAD
import { NextResponse }     from 'next/server';
import { getServerSession }  from 'next-auth';
import { authOptions }       from '@/app/api/auth/[...nextauth]/route';
import dbInit, { Inquiry, Property, Agent, User } from '@/lib/dbInit';
import { sendInquiryEmail } from '@/lib/mailer';

=======
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions, getAdminEmails } from '@/lib/auth';
import dbInit, { Inquiry, Property } from '@/lib/dbInit';
import { sendInquiryEmail } from '@/lib/mailer';

// POST — koi bhi (guest/user) inquiry bhej sakta hai.
// Inquiry DB mein save hoti hai (admin dashboard ke Inquiries section mein dikhti hai)
// aur saare admins ke email par mail jaati hai.
>>>>>>> origin/main
export async function POST(req) {
  await dbInit();

  try {
    const body = await req.json();
    const { property_id, name, email, phone, message } = body;

<<<<<<< HEAD
    if (!property_id || !name || !email || !message) {
      return NextResponse.json(
        { error: 'Property ID, naam, email aur message required hai.' },
=======
    if (!property_id || !name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'Property ID, name, email and message are required.' },
>>>>>>> origin/main
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    const user_id = session?.user?.id || null;

<<<<<<< HEAD
    // Property fetch karo — agent aur owner dono ke saath
    const property = await Property.findByPk(property_id, {
      include: [
        { model: Agent, as: 'agent' },
        { model: User,  as: 'owner' },
      ],
    });

    if (!property) {
      return NextResponse.json({ error: 'Property nahi mili.' }, { status: 404 });
    }

    // Inquiry save karo
    const inquiry = await Inquiry.create({
      property_id,
      user_id,
      name,
      email,
      phone:   phone || null,
      message,
    });

    const inquiryData = { name, email, phone, message };

    // ── Email bhejo ──

    // 1. Agent ko email (agar agent assigned hai)
    if (property.agent?.email) {
      try {
        await sendInquiryEmail({
          agentEmail: property.agent.email,
          agentName:  property.agent.name,
          property,
          inquiry:    inquiryData,
        });
        console.log('✅ Agent ko email gaya:', property.agent.email);
      } catch (e) {
        console.error('⚠️ Agent email failed:', e.message);
      }
    }

    // 2. Property owner ko email (agar user ne list kiya tha)
    if (property.contact_email && property.contact_email !== property.agent?.email) {
      try {
        await sendInquiryEmail({
          agentEmail: property.contact_email,
          agentName:  property.owner?.name || 'Property Owner',
          property,
          inquiry:    inquiryData,
        });
        console.log('✅ Owner ko email gaya:', property.contact_email);
      } catch (e) {
        console.error('⚠️ Owner email failed:', e.message);
      }
=======
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
>>>>>>> origin/main
    }

    return NextResponse.json(
      { success: true, inquiry_id: inquiry.id },
      { status: 201 }
    );
<<<<<<< HEAD

  } catch (error) {
    console.error('❌ Inquiry error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
=======
  } catch (error) {
    console.error('❌ Inquiry error:', error);
    return NextResponse.json({ error: 'Could not send inquiry.' }, { status: 500 });
  }
}
>>>>>>> origin/main
