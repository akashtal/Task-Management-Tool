import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '@/lib/drizzle';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await db
            .select()
            .from(users)
            .where(eq(users.email, credentials.email))
            .limit(1);

          if (!user.length) {
            return null;
          }

          const foundUser = user[0];

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            foundUser.password
          );

          if (!isPasswordValid) {
            console.log('Invalid password');
            return null;
          }
          return {
            id: foundUser.id.toString(), // Make sure it's a string for NextAuth
            email: foundUser.email,
            role: foundUser.role || 'user',
            approved: !!foundUser.approved,
          };
        } catch (err) {
          console.error('Error during authorization', err);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: 'jwt',
  },

  callbacks: {
    async jwt({ token, user }) {      
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.approved = user.approved;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.approved = token.approved as boolean;
      }
      return session;
    },
  },

  pages: {
    signIn: '/auth/login',
  },
};
