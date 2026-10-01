import { NextResponse } from 'next/server';
import dbInit, { Property, PropertyImage } from '@/lib/dbInit';

// GET /api/properties/:id — PUBLIC
export async function GET(req, { params }) {
  const { id } = await params;
  await dbInit();

  const property = await Property.findByPk(id, {
    include: [{ model: PropertyImage, as: 'images' }],
    order: [[{ model: PropertyImage, as: 'images' }, 'order', 'ASC']],
  });

  if (!property) {
    return NextResponse.json({ error: 'Property not found' }, { status: 404 });
  }

  return NextResponse.json(property);
}
