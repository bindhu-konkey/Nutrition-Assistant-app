import { db } from '../config/db';

export interface IWaterLog {
  _id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  glasses: number;
  createdAt: string;
}

export const WaterLog = {
  find: (filter?: Partial<IWaterLog>) => db.waterLogs.find(filter),
  findOne: (filter?: Partial<IWaterLog>) => db.waterLogs.findOne(filter),
  findById: (id: string) => db.waterLogs.findById(id),
  create: (data: Omit<IWaterLog, '_id' | 'createdAt'>) => db.waterLogs.create(data),
  findByIdAndUpdate: (id: string, updateData: Partial<IWaterLog>) => db.waterLogs.findByIdAndUpdate(id, updateData),
  findByIdAndDelete: (id: string) => db.waterLogs.findByIdAndDelete(id),
};
