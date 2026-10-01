import CredentialsProvider from 'next-auth/providers/credentials';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbInit from '@/lib/dbInit';
import User from '@/models/User';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await dbInit();

        const user = await User.findOne({
          where: { email: credentials?.email },
        });

        if (!user) throw new Error('Email registered nahi hai');

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) throw new Error('Password galat hai');

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: { signIn: '/admin/login' },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
};

/*
  API routes mein use karo:
  const { error } = await requireAdmin();
  if (error) return error;
*/
export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return {
      error: NextResponse.json(
        { message: 'Login required' },
        { status: 401 }
      ),
    };
  }

  if (session.user.role?.toLowerCase() !== 'admin') {
    return {
      error: NextResponse.json(
        { message: 'Only admin allowed' },
        { status: 403 }
      ),
    };
  }

  return { session };
}

/*
  Saare admins ke email — inquiry mail yahin jaati hai.
  Optional: .env.local mein ADMIN_NOTIFY_EMAIL=abc@gmail.com,xyz@gmail.com daal do
  to un par bhi mail jayegi.
*/
export async function getAdminEmails() {
  const admins = await User.findAll({
    where: { role: 'admin' },
    attributes: ['email'],
  });

  const extra = (process.env.ADMIN_NOTIFY_EMAIL || '')
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean);

  return [...new Set([...admins.map((a) => a.email), ...extra])];
}
