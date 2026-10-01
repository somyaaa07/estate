import { NextResponse } from 'next/server';
import dbInit, { Inquiry } from '@/lib/dbInit';
<<<<<<< HEAD

// PATCH — status update karo
export async function PATCH(req, { params }) {
=======
import { requireAdmin } from '@/lib/auth';

// PATCH — status update karo
export async function PATCH(req, { params }) {
  const { error } = await requireAdmin();
  if (error) return error;

>>>>>>> origin/main
  try {
    await dbInit();
    const { id }    = await params;
    const { status } = await req.json();
<<<<<<< HEAD
=======
    if (!['new', 'read', 'replied'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
>>>>>>> origin/main

    await Inquiry.update({ status }, { where: { id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('❌ Status update error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE — inquiry delete karo
export async function DELETE(req, { params }) {
<<<<<<< HEAD
=======
  const { error } = await requireAdmin();
  if (error) return error;

>>>>>>> origin/main
  try {
    await dbInit();
    const { id } = await params;

    await Inquiry.destroy({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('❌ Delete inquiry error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}