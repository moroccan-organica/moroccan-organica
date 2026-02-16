import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { supabase } from '@/lib/supabase';
import * as bcryptModule from 'bcryptjs';
const bcrypt = (bcryptModule as Record<string, unknown>).default as typeof bcryptModule || bcryptModule;

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Invalid credentials');
                }

                const { data: user, error } = await supabase
                    .from('User')
                    .select('*')
                    .eq('email', credentials.email)
                    .single();

                if (error || !user || !user.password) {
                    throw new Error('Invalid credentials');
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isPasswordValid) {
                    throw new Error('Invalid credentials');
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                };
            },
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                // Use token.sub for the ID (NextAuth standard) to ensure it persists
                token.sub = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session?.user) {
                // token.sub is the standard NextAuth property for user ID
                session.user.id = token.sub as string;
                if (token.role) {
                    session.user.role = token.role as string;
                }
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};
