import fs from 'fs';
import path from 'path';

const DB_DIR = path.join(process.cwd(), 'data-db');

// Ensure DB directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

export class Collection<T extends { _id: string }> {
  private filePath: string;
  private memoryCache: T[] = [];

  constructor(public name: string) {
    this.filePath = path.join(DB_DIR, `${name}.json`);
    this.load();
  }

  private load() {
    try {
      if (fs.existsSync(this.filePath)) {
        const data = fs.readFileSync(this.filePath, 'utf8');
        this.memoryCache = JSON.parse(data);
      } else {
        this.memoryCache = [];
        this.saveToDisk();
      }
    } catch (error) {
      console.error(`Error loading database collection ${this.name}:`, error);
      this.memoryCache = [];
    }
  }

  private saveToDisk() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.memoryCache, null, 2), 'utf8');
    } catch (error) {
      console.error(`Error saving database collection ${this.name}:`, error);
    }
  }

  async find(filter: Partial<T> = {}): Promise<T[]> {
    return this.memoryCache.filter(item => {
      for (const key in filter) {
        if (item[key] !== filter[key]) return false;
      }
      return true;
    });
  }

  async findOne(filter: Partial<T> = {}): Promise<T | null> {
    const results = await this.find(filter);
    return results[0] || null;
  }

  async findById(id: string): Promise<T | null> {
    const item = this.memoryCache.find(x => x._id === id);
    return item || null;
  }

  async create(data: Omit<T, '_id' | 'createdAt'> & { _id?: string, createdAt?: string }): Promise<T> {
    const newItem = {
      ...data,
      _id: data._id || Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      createdAt: data.createdAt || new Date().toISOString(),
    } as unknown as T;

    this.memoryCache.push(newItem);
    this.saveToDisk();
    return newItem;
  }

  async findByIdAndUpdate(id: string, updateData: Partial<T>, options: { new?: boolean } = {}): Promise<T | null> {
    const idx = this.memoryCache.findIndex(x => x._id === id);
    if (idx === -1) return null;

    const updated = {
      ...this.memoryCache[idx],
      ...updateData,
      _id: id, // Keep original ID
    };

    this.memoryCache[idx] = updated;
    this.saveToDisk();
    return updated;
  }

  async findByIdAndDelete(id: string): Promise<T | null> {
    const idx = this.memoryCache.findIndex(x => x._id === id);
    if (idx === -1) return null;

    const removed = this.memoryCache[idx];
    this.memoryCache.splice(idx, 1);
    this.saveToDisk();
    return removed;
  }

  async deleteMany(filter: Partial<T> = {}): Promise<number> {
    const initialCount = this.memoryCache.length;
    this.memoryCache = this.memoryCache.filter(item => {
      for (const key in filter) {
        if (item[key] === filter[key]) return false;
      }
      return true;
    });
    this.saveToDisk();
    return initialCount - this.memoryCache.length;
  }
}

export const db = {
  users: new Collection<any>('users'),
  meals: new Collection<any>('meals'),
  waterLogs: new Collection<any>('water_logs'),
  goals: new Collection<any>('goals'),
  profiles: new Collection<any>('profiles'),
};
