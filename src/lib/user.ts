import client from '@/lib/db';
import { User, UserPreferences } from '@/lib/types/user';

// Get MongoDB collection
const getUsersCollection = () => {
  const db = client.db('huddle-chat');
  return db.collection<User>('users');
};

// Create a new user
export const createUser = async (user: User) => {
  const users = getUsersCollection();
  const result = await users.insertOne({ ...user, createdAt: new Date() });
  return result.insertedId;
};

// Find user by email
export const getUserByEmail = async (email: string) => {
  const users = getUsersCollection();
  return users.findOne({ email });
};

// Update user preferences
export const updateUserPreferences = async (
  email: string,
  preferences: UserPreferences,
) => {
  const users = getUsersCollection();
  return users.updateOne({ email }, { $set: { preferences } });
};
