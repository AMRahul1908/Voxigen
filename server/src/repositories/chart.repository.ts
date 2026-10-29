import mongoose from 'mongoose';
import { Kundali } from '../models/Kundali';
import { NormalizedKundaliData } from '../types/astrology.types';

// In-memory fallback cache to ensure zero downtime when MONGODB_URI is not set
const memoryStore = new Map<string, NormalizedKundaliData>();

export class ChartRepository {
  private isMongoConnected(): boolean {
    return mongoose.connection.readyState === 1;
  }

  public async create(data: NormalizedKundaliData): Promise<NormalizedKundaliData> {
    if (this.isMongoConnected()) {
      try {
        const doc = new Kundali(data);
        await doc.save();
        return doc.toObject() as unknown as NormalizedKundaliData;
      } catch (err) {
        console.warn('[ChartRepository] Failed to save to MongoDB, saving to memory fallback:', err);
      }
    }

    memoryStore.set(data.chartId, data);
    return data;
  }

  public async findByChartId(chartId: string): Promise<NormalizedKundaliData | null> {
    if (this.isMongoConnected()) {
      try {
        const doc = await Kundali.findOne({ chartId }).lean();
        if (doc) {
          return doc as unknown as NormalizedKundaliData;
        }
      } catch (err) {
        console.warn('[ChartRepository] MongoDB query failed, checking memory fallback:', err);
      }
    }

    return memoryStore.get(chartId) || null;
  }

  public async updateByChartId(chartId: string, updateData: Partial<NormalizedKundaliData>): Promise<NormalizedKundaliData | null> {
    if (this.isMongoConnected()) {
      try {
        const updated = await Kundali.findOneAndUpdate(
          { chartId },
          { $set: updateData },
          { new: true }
        ).lean();
        if (updated) {
          return updated as unknown as NormalizedKundaliData;
        }
      } catch (err) {
        console.warn('[ChartRepository] MongoDB update failed, updating memory fallback:', err);
      }
    }

    const existing = memoryStore.get(chartId);
    if (!existing) return null;

    const merged = { ...existing, ...updateData, updatedAt: new Date().toISOString() };
    memoryStore.set(chartId, merged);
    return merged;
  }

  public async deleteByChartId(chartId: string): Promise<boolean> {
    let deletedMongo = false;
    if (this.isMongoConnected()) {
      try {
        const res = await Kundali.deleteOne({ chartId });
        deletedMongo = res.deletedCount > 0;
      } catch (err) {
        console.warn('[ChartRepository] MongoDB delete failed:', err);
      }
    }

    const deletedMemory = memoryStore.delete(chartId);
    return deletedMongo || deletedMemory;
  }
}

export const chartRepository = new ChartRepository();
