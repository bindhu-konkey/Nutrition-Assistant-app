import { db } from '../config/db';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export const User = {
  find: (filter?: Partial<IUser>) => db.users.find(filter),
  findOne: (filter?: Partial<IUser>) => db.users.findOne(filter),
  findById: (id: string) => db.users.findById(id),
  create: (data: Omit<IUser, '_id' | 'createdAt'>) => db.users.create(data),
  findByIdAndUpdate: (id: string, updateData: Partial<IUser>) => db.users.findByIdAndUpdate(id, updateData),
  findByIdAndDelete: (id: string) => db.users.findByIdAndDelete(id),
};
