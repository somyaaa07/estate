import { NextResponse }  from 'next/server';
import dbInit, { Inquiry, Property, PropertyImage } from '@/lib/dbInit';
import { requireAdmin } from '@/lib/auth';

// GET — saari inquiries
export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await dbInit();

    const inquiries = await Inquiry.findAll({
      order: [['created_at', 'DESC']],
      include: [
        {
          model:    Property,
          as:       'property',
          required: false,
          include:  [{
            model: PropertyImage,
            as:    'images',
            limit: 1,
            order: [['order', 'ASC']],
          }],
        },
      ],
    });

    return NextResponse.json(inquiries);
  } catch (err) {
    console.error('❌ Admin inquiries error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}