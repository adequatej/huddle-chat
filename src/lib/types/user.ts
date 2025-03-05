import { ObjectId } from 'mongodb';

export type UserPreferences = {
  notifications: boolean;
  onboarded?: boolean;
  favoriteTrains?: string[];
};

export type User = {
  _id?: ObjectId;
  name: string;
  email: string;
  image?: string | null;
  createdAt?: Date;
  preferences?: UserPreferences;
};
