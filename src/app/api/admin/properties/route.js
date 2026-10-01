import { NextResponse } from 'next/server';
<<<<<<< HEAD
import { Op } from 'sequelize'; // ✅ moved to top
import dbInit, { Property, PropertyImage } from '@/lib/dbInit';

export async function GET(req) {
  await dbInit();

  const { searchParams } = new URL(req.url);
  const type     = searchParams.get('type');
  const city     = searchParams.get('city');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');

  const where = {};

  // ✅ case-insensitive type match (buy = Buy = BUY)
if (type) where.type = { [Op.like]: type };   // ✅ MySQL compatible
  if (city) where.city = { [Op.like]: city }; 

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price[Op.gte] = Number(minPrice); // ✅ convert to number
    if (maxPrice) where.price[Op.lte] = Number(maxPrice); // ✅ convert to number
  }

  const properties = await Property.findAll({
    where,
    include: [{ model: PropertyImage, as: 'images', order: [['order', 'ASC']] }],
    order: [['created_at', 'DESC']],
=======
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
>>>>>>> origin/main
  });

  return NextResponse.json(properties);
}

<<<<<<< HEAD
export async function POST(req) {
  await dbInit();

  try {
    const body = await req.json();

    const {
      title, description, price, type, property_type,
      location, city, area, bedrooms, bathrooms,
      agent_id, status,
      images = [],
    } = body;

    if (!title || !price || !city || !type || !property_type || !location) {
      return NextResponse.json(
        { error: 'Title, price, city, type, property_type aur location required hai.' },
        { status: 400 }
      );
    }

    const property = await Property.create({
      title,
      description,
      price,
      type:          type.toLowerCase(),  // ✅ always store as lowercase
      property_type,
      location,
      city,
      area:      area      || null,
      bedrooms:  bedrooms  || null,
      bathrooms: bathrooms || null,
      agent_id:  agent_id  || null,
      status:    status    || 'active',
    });

    if (images.length > 0) {
      const imageRows = images.map((url, index) => ({
        property_id: property.id,
        url,
        order: index,
      }));
      await PropertyImage.bulkCreate(imageRows);
    }

    const result = await Property.findByPk(property.id, {
      include: [{ model: PropertyImage, as: 'images' }],
    });

    return NextResponse.json(result, { status: 201 });

  } catch (error) {
    console.error('❌ Property create error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
=======
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
>>>>>>> origin/main
