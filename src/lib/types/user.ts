import { ObjectId } from 'mongodb';

export type UserPreferences = {
  notifications: boolean;
  onboarded?: boolean;
  favoriteTrains?: string[];
};

export type User = {
  _id?: ObjectId;
  id?: string;
  name: string;
  email: string;
  image?: string | null;
  createdAt?: Date;
  preferences?: UserPreferences;
};

export type PublicUser = Omit<
  User,
  '_id' | 'createdAt' | 'email' | 'preferences'
> & {
  id: string;
};
