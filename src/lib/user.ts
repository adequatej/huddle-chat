import { ObjectId } from 'mongodb';
import client from '@/lib/db';

// Will add more preferences later
export type User = {
  _id?: ObjectId;
  name: string;
  email: string;
  image?: string | null;
  createdAt?: Date;
  preferences?: {
    notifications?: boolean;
  };
};

// Get MongoDB collection
const getUsersCollection = () => {
  const db = client.db(process.env.MONGODB_DB);
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
  preferences: User['preferences'],
) => {
  const users = getUsersCollection();
  return users.updateOne({ email }, { $set: { preferences } });
};
