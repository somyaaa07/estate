import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import dbInit, { User, Property, Inquiry } from '@/lib/dbInit';

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  await dbInit();

  const [properties, available, sold, inquiries, users, newInquiries] = await Promise.all([
    Property.count(),
    Property.count({ where: { status: 'active' } }),
    Property.count({ where: { status: ['sold', 'rented'] } }),
    Inquiry.count(),
    User.count(),
    Inquiry.count({ where: { status: 'new' } }),
  ]);

  return NextResponse.json({ properties, available, sold, inquiries, users, newInquiries });
}
