import { NextResponse } from 'next/server';
import dbInit, { Property, PropertyImage } from '@/lib/dbInit';
import { buildPropertyQuery } from '@/lib/propertyQuery';

// GET /api/properties?type=&city=&... — PUBLIC (website listing)
export async function GET(req) {
  try {
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
          order: [['order', 'ASC']],
        },
      ],
    });

    return NextResponse.json(properties);
  } catch (err) {
    console.error('❌ Public properties error:', err.message);
    return NextResponse.json({ error: 'Could not load properties' }, { status: 500 });
  }
}
