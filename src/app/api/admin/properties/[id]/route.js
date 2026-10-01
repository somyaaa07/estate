import { NextResponse } from 'next/server';
import dbInit, { Property, PropertyImage } from '@/lib/dbInit';
import { requireAdmin } from '@/lib/auth';
import { sanitizePropertyInput } from '@/lib/propertyOptions';

const withImages = {
  include: [{ model: PropertyImage, as: 'images' }],
  order: [[{ model: PropertyImage, as: 'images' }, 'order', 'ASC']],
};

// GET — edit page ke liye (sirf ADMIN)
export async function GET(req, { params }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  await dbInit();

  const property = await Property.findByPk(id, withImages);
  if (!property) {
    return NextResponse.json({ error: 'Property not found' }, { status: 404 });
  }
  return NextResponse.json(property);
}

// PUT — edit (sirf ADMIN). Images bhej do to wo replace ho jaati hain.
export async function PUT(req, { params }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  await dbInit();

  const property = await Property.findByPk(id);
  if (!property) {
    return NextResponse.json({ error: 'Property not found' }, { status: 404 });
  }

  const body = await req.json();
  const { data, error: inputError } = sanitizePropertyInput(body, { partial: true });
  if (inputError) {
    return NextResponse.json({ error: inputError }, { status: 400 });
  }

  await property.update(data);

  if (Array.isArray(body.images)) {
    const images = body.images.filter(Boolean);
    await PropertyImage.destroy({ where: { property_id: id } });
    if (images.length > 0) {
      await PropertyImage.bulkCreate(
        images.map((url, index) => ({ property_id: id, url, order: index }))
      );
    }
  }

  const updated = await Property.findByPk(id, withImages);
  return NextResponse.json(updated);
}

// DELETE — property + uski images/inquiries/saved records (sirf ADMIN)
export async function DELETE(req, { params }) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    await dbInit();

    const property = await Property.findByPk(id);
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    const { Inquiry, SavedProperty } = await import('@/lib/dbInit');
    await PropertyImage.destroy({ where: { property_id: id } });
    await SavedProperty.destroy({ where: { property_id: id } });
    await Inquiry.destroy({ where: { property_id: id } });
    await property.destroy();

    return NextResponse.json({ message: 'Property deleted' });
  } catch (err) {
    console.error('Delete error:', err);
    return NextResponse.json({ error: 'Could not delete property.' }, { status: 500 });
  }
}
