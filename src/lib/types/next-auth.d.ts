import 'next-auth';

// Modifies next auth's types to include our custom fields
declare module 'next-auth' {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      onboarded?: boolean;
    };
  }

  interface User {
    onboarded?: boolean;
    preferences?: {
      notifications: boolean;
      onboarded?: boolean;
    };
  }
}
