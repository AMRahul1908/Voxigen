import mongoose, { Document, Schema } from 'mongoose';
import { ProductId } from '../config/products';
export interface IUserDocument extends Document {
  name: string; email: string; passwordHash: string; birthDate: string; birthTime: string;
  birthPlace: string; gender: string; location: string; contact: string;
  selectedProductId: ProductId; membershipStatus: 'pending' | 'active' | 'expired';
  privacyConsentAt: Date;
  createdAt: Date; updatedAt: Date;
}
const UserSchema = new Schema<IUserDocument>({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true, select: false },
  birthDate: { type: String, required: true }, birthTime: { type: String, required: true },
  birthPlace: { type: String, required: true, trim: true },
  gender: { type: String, required: true, enum: ['female', 'male', 'other', 'prefer_not_to_say'] },
  location: { type: String, required: true, trim: true }, contact: { type: String, required: true, trim: true },
  selectedProductId: { type: String, required: true, enum: ['basic_horoscope', 'bronze_horoscope', 'basic_voice', 'silver_bundle', 'gold_voice'] },
  membershipStatus: { type: String, enum: ['pending', 'active', 'expired'], default: 'pending' },
  privacyConsentAt: { type: Date, required: true },
}, { timestamps: true, minimize: true });
export const User = mongoose.model<IUserDocument>('User', UserSchema);
