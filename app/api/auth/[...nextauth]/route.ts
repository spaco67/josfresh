import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { AuthOptions } from 'next-auth';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          await dbConnect();
          
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Please provide email and password');
          }

          // Find user by email and include password and role
          const user = await User.findOne({ email: credentials.email })
            .select('+password')
            .lean();
          
          if (!user) {
            console.log('User not found:', credentials.email);
            return null;
          }

          // Check password
          const isMatch = await User.schema.methods.matchPassword.call(
            user,
            credentials.password
          );
          
          if (!isMatch) {
            console.log('Password does not match');
            return null;
          }

          // Return user without password
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            farmDetails: user.role === 'farmer' ? user.farmDetails : undefined,
          };
        } catch (error) {
          console.error('Auth error:', error);
          throw new Error('Authentication failed');
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        if (user.role === 'farmer') {
          token.farmDetails = user.farmDetails;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        if (token.role === 'farmer') {
          (session.user as any).farmDetails = token.farmDetails;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };