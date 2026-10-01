import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import dbInit, { Property, PropertyImage } from '@/lib/dbInit';
import { buildPropertyQuery } from '@/lib/propertyQuery';
import { sanitizePropertyInput } from '@/lib/propertyOptions';

// GET — admin ko saari properties dikhti hain
export async function GET(req) {
  const { error } = await requireAdmin();
  if (error) return error;

  await dbInit();
  const { searchParams } = new URL(req.url);
  const { where, order } = buildPropertyQuery(searchParams);

  const properties = await Property.findAll({
    where,
    order,
    include: [
      {
        model: PropertyImage,
        as: 'images',
        separate: true,
        limit: 1,
        order: [['order', 'ASC']],
      },
    ],
  });

  return NextResponse.json(properties);
}

// POST — nayi property list karo (sirf ADMIN)
export async function POST(req) {
  const { error, session } = await requireAdmin();
  if (error) return error;

  await dbInit();

  const body = await req.json();
  const { data, error: inputError } = sanitizePropertyInput(body);
  if (inputError) {
    return NextResponse.json({ error: inputError }, { status: 400 });
  }

  if (!data.title || !data.price || !data.city || !data.type || !data.property_type || !data.location) {
    return NextResponse.json(
      { error: 'Title, price, type, property type, location aur city required hai' },
      { status: 400 }
    );
  }

  const property = await Property.create({
    ...data,
    status: data.status || 'active',
    user_id: session.user.id,
    contact_email: session.user.email,
  });

  const images = Array.isArray(body.images) ? body.images.filter(Boolean) : [];
  if (images.length > 0) {
    await PropertyImage.bulkCreate(
      images.map((url, index) => ({ property_id: property.id, url, order: index }))
    );
  }

  return NextResponse.json({ success: true, id: property.id });
}
