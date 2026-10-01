import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbInit from '@/lib/dbInit';
import User from '@/models/User';

<<<<<<< HEAD
export async function POST(req) {
  await dbInit();

  const { name, email, password ,role} = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: 'fill all the fields ' },
=======
// GET — kya abhi tak koi admin bana hai? (needsSetup = true => first-time register open hai)
export async function GET() {
  await dbInit();
  const adminCount = await User.count({ where: { role: 'admin' } });
  return NextResponse.json({ needsSetup: adminCount === 0 });
}

// POST — SIRF pehla admin register ho sakta hai. Uske baad signup band.
export async function POST(req) {
  await dbInit();

  const adminCount = await User.count({ where: { role: 'admin' } });
  if (adminCount > 0) {
    return NextResponse.json(
      { error: 'Admin already registered. Signup is closed.' },
      { status: 403 }
    );
  }

  const { name, email, password } = await req.json();

  if (!name?.trim() || !email?.trim() || !password) {
    return NextResponse.json({ error: 'Fill all the fields' }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: 'Password must be at least 8 characters' },
>>>>>>> origin/main
      { status: 400 }
    );
  }

<<<<<<< HEAD
  const existing = await User.findOne({ where: { email } });

  if (existing) {
    return NextResponse.json(
      { error: 'Email already registered' },
      { status: 409 }
    );
  }

  const hashed = await bcrypt.hash(password, 12);

  await User.create({ name, email, password: hashed , role });

  return NextResponse.json({ message: 'Account Created!' });
}
=======
  const cleanEmail = email.trim().toLowerCase();
  const existing = await User.findOne({ where: { email: cleanEmail } });
  const hashed = await bcrypt.hash(password, 12);

  if (existing) {
    // Email pehle se (normal user ke roop mein) hai — usse hi admin bana do
    // (sirf tab jab koi admin hai hi nahi, upar check ho chuka hai)
    await existing.update({ name: name.trim(), password: hashed, role: 'admin' });
  } else {
    await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: hashed,
      role: 'admin', // role client se kabhi nahi liya jata
    });
  }

  return NextResponse.json({ message: 'Admin account created!' });
}
>>>>>>> origin/main
