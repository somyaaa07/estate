import { NextResponse } from 'next/server';
import dbInit, { Property } from '@/lib/dbInit';

export async function GET() {
  await dbInit();

  // Sold/rented properties ki city bhi dikhni chahiye kyunki listing mein wo bhi aati hain
  const properties = await Property.findAll({ attributes: ['city'] });

  const cities = [...new Set(
    properties.map((p) => p.city).filter(Boolean)
  )].sort();

  return NextResponse.json(cities);
}
