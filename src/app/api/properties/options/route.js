import { NextResponse } from 'next/server';
import { PROPERTY_OPTIONS } from '@/lib/propertyOptions';

// GET /api/properties/options — form dropdowns/suggestions backend se aate hain
export async function GET() {
  return NextResponse.json(PROPERTY_OPTIONS);
}
