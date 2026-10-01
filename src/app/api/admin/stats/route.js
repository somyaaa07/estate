import { NextResponse } from 'next/server';
<<<<<<< HEAD
import dbInit, { User, Agent, Property, Inquiry } from '@/lib/dbInit';

export async function GET() {
  await dbInit();

  const [properties, agents, inquiries, users, newInquiries] = await Promise.all([
    Property.count(),
    Agent.count(),
=======
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
>>>>>>> origin/main
    Inquiry.count(),
    User.count(),
    Inquiry.count({ where: { status: 'new' } }),
  ]);

<<<<<<< HEAD
  return NextResponse.json({ properties, agents, inquiries, users, newInquiries });
}
=======
  return NextResponse.json({ properties, available, sold, inquiries, users, newInquiries });
}
>>>>>>> origin/main
