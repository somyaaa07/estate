import { NextResponse } from 'next/server';
<<<<<<< HEAD
import dbInit, { Property, PropertyImage } from '@/lib/dbInit'; // ✅ named imports

export async function GET(req, { params }) {
  const { id } = await params;
  await dbInit();

  const property = await Property.findByPk(id, {
    include: [{ model: PropertyImage, as: 'images', order: [['order', 'ASC']] }], // ✅ join images
  });

  if (!property) return NextResponse.json({ error: 'Didnt find property' }, { status: 404 });
  return NextResponse.json(property);
}

export async function PUT(req, { params }) {
  const { id } = await params;
  await dbInit();
  const body = await req.json();
  await Property.update(body, { where: { id } });

  // ✅ Return updated property with images
  const property = await Property.findByPk(id, {
    include: [{ model: PropertyImage, as: 'images', order: [['order', 'ASC']] }],
  });

  return NextResponse.json(property);
}

export async function DELETE(req, { params }) {
=======
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

>>>>>>> origin/main
  try {
    const { id } = await params;
    await dbInit();

    const property = await Property.findByPk(id);
    if (!property) {
<<<<<<< HEAD
      return NextResponse.json({ error: 'Didnt find property' }, { status: 404 });
    }

    await property.destroy();
    return NextResponse.json({ message: 'Property deleted' });

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
=======
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
>>>>>>> origin/main
