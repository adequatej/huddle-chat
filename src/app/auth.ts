import client from '@/lib/db';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import type { Provider } from 'next-auth/providers';
import { updateUserPreferences, getUserByEmail } from '@/lib/user';

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
  events: {
    createUser: async ({ user }) => {
      // Update the Auth.js user with our custom fields
      await updateUserPreferences(user.email!, {
        notifications: true,
        onboarded: false, // New users start as not onboarded
      });
    },
  },
  callbacks: {
    // Add user ID to session
    async session({ session }) {
      const existingUser = await getUserByEmail(session.user.email!);

      if (existingUser) {
        session.user.id = existingUser._id?.toString();
        // Add onboarded status to session
        session.user.onboarded = existingUser.preferences?.onboarded ?? false;
      }

      return session;
    },
  },
});
