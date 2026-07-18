import { Response } from 'express';
import { WaterLog } from '../models/WaterLog';
import { AuthRequest } from '../middleware/authMiddleware';

export const getWaterLog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { date } = req.query; // YYYY-MM-DD
    if (!date) {
      res.status(400).json({ success: false, message: 'Date parameter is required' });
      return;
    }

    let log = await WaterLog.findOne({ userId, date: String(date) });
    if (!log) {
      // Return a virtual log with 0 glasses so frontend is happy
      log = {
        _id: 'virtual',
        userId,
        date: String(date),
        glasses: 0,
        createdAt: new Date().toISOString(),
      };
    }

    res.status(200).json({ success: true, waterLog: log });
  } catch (error: any) {
    console.error('getWaterLog Error:', error);
    res.status(500).json({ success: false, message: 'Error fetching water log' });
  }
};

export const updateWaterLog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { glasses, date } = req.body;
    if (glasses === undefined || !date) {
      res.status(400).json({ success: false, message: 'Please provide glasses and date' });
      return;
    }

    const parsedGlasses = Number(glasses);
    if (isNaN(parsedGlasses) || parsedGlasses < 0) {
      res.status(400).json({ success: false, message: 'Glasses must be a non-negative number' });
      return;
    }

    let log = await WaterLog.findOne({ userId, date });
    if (log) {
      log = await WaterLog.findByIdAndUpdate(log._id, { glasses: parsedGlasses });
    } else {
      log = await WaterLog.create({
        userId,
        date,
        glasses: parsedGlasses,
      });
    }

    res.status(200).json({ success: true, waterLog: log });
  } catch (error: any) {
    console.error('updateWaterLog Error:', error);
    res.status(500).json({ success: false, message: 'Error updating water log' });
  }
};
