import mongoose, { Schema, Document } from 'mongoose';
import { NormalizedKundaliData } from '../types/astrology.types';

export interface IKundaliDocument extends Document, Omit<NormalizedKundaliData, 'createdAt' | 'updatedAt'> {
  createdAt: Date;
  updatedAt: Date;
}

const KundaliSchema = new Schema<IKundaliDocument>(
  {
    chartId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    birthDate: {
      type: String,
      required: true
    },
    birthTime: {
      type: String,
      required: true
    },
    birthTimeUnknown: {
      type: Boolean,
      default: false
    },
    birthPlace: {
      type: String,
      required: true
    },
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    },
    timeZone: {
      type: Number,
      required: true
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer_not_to_say'],
      default: 'prefer_not_to_say'
    },
    calculationSystem: {
      type: String,
      default: 'Vedic Sidereal (Nirayana)'
    },
    ayanamsha: {
      type: String,
      default: 'Chitrapaksha / Lahiri'
    },
    ayanamshaDegree: {
      type: Number
    },
    ascendant: {
      type: Schema.Types.Mixed,
      required: true
    },
    moonSign: {
      type: Schema.Types.Mixed,
      required: true
    },
    sunSign: {
      type: Schema.Types.Mixed,
      required: true
    },
    janmaNakshatra: {
      type: Schema.Types.Mixed,
      required: true
    },
    planetaryPositions: {
      type: Schema.Types.Mixed,
      required: true
    },
    houses: {
      type: Schema.Types.Mixed,
      required: true
    },
    divisionalCharts: {
      type: Schema.Types.Mixed,
      required: true
    },
    dashaPeriods: {
      type: Schema.Types.Mixed,
      required: true
    },
    aspects: {
      type: Schema.Types.Mixed
    },
    yogas: {
      type: Schema.Types.Mixed
    },
    interpretations: {
      type: Schema.Types.Mixed,
      required: true
    },
    calculationProvider: {
      type: String,
      enum: ['navamsha', 'astronomy_engine_vedic'],
      default: 'astronomy_engine_vedic'
    }
  },
  {
    timestamps: true
  }
);

KundaliSchema.index({ createdAt: -1 });

export const Kundali = mongoose.model<IKundaliDocument>('Kundali', KundaliSchema);
