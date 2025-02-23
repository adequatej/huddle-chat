import client from '@/lib/db';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import type { Provider } from 'next-auth/providers';
import { getUserByEmail, createUser } from '@/lib/user';

const providers: Provider[] = [Google, GitHub];

export const providerMap = providers
  .map((provider) => {
    if (typeof provider === 'function') {
      const providerData = provider();
      return { id: providerData.id, name: providerData.name };
    } else {
      return { id: provider.id, name: provider.name };
    }
  })
  .filter((provider) => provider.id !== 'credentials');

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(client, { databaseName: 'huddle-chat' }),
  providers,
  pages: {
    signIn: '/signin',
  },
  callbacks: {
    // Handle user sign-in
    async signIn({ user }) {
      // Check if user exists in DB
      const existingUser = await getUserByEmail(user.email!);

      // If user does not exist, create one
      if (!existingUser) {
        await createUser({
          name: user.name!,
          email: user.email!,
          image: user.image,
          preferences: {
            notifications: true,
          },
          chatHistory: {
            lastViewed: new Date(),
            recentChats: [],
          },
        });
      }

      return true; // Allow sign-in
    },

    // Add user ID to session
    async session({ session }) {
      const existingUser = await getUserByEmail(session.user.email!);

      if (existingUser) {
        session.user.id = existingUser._id?.toString(); // Convert MongoDB ObjectId to string
      }

      return session;
    },
  },
});
