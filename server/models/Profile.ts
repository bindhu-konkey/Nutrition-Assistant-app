import { db } from '../config/db';

export interface IProfile {
  _id: string;
  userId: string;
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  goal: 'Weight Loss' | 'Weight Gain' | 'Maintain Weight';
  createdAt: string;
}

export const Profile = {
  find: (filter?: Partial<IProfile>) => db.profiles.find(filter),
  findOne: (filter?: Partial<IProfile>) => db.profiles.findOne(filter),
  findById: (id: string) => db.profiles.findById(id),
  create: (data: Omit<IProfile, '_id' | 'createdAt'>) => db.profiles.create(data),
  findByIdAndUpdate: (id: string, updateData: Partial<IProfile>) => db.profiles.findByIdAndUpdate(id, updateData),
  findByIdAndDelete: (id: string) => db.profiles.findByIdAndDelete(id),
};
