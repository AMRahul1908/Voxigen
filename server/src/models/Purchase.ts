import mongoose, { Document, Schema } from 'mongoose';
import { ProductId } from '../config/products';
export interface IPurchase extends Document { userId: mongoose.Types.ObjectId; productId: ProductId; amountPaise: number; orderId: string; paymentId?: string; status: 'created' | 'paid' | 'failed'; validUntil?: Date; remainingViews?: number | null; supportLifetime: boolean; }
const PurchaseSchema = new Schema<IPurchase>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  productId: { type: String, enum: ['basic_horoscope', 'bronze_horoscope', 'basic_voice', 'silver_bundle', 'gold_voice'], required: true },
  amountPaise: { type: Number, required: true }, orderId: { type: String, required: true, unique: true },
  paymentId: { type: String, unique: true, sparse: true }, status: { type: String, enum: ['created', 'paid', 'failed'], default: 'created' },
  validUntil: Date, remainingViews: { type: Number, default: null }, supportLifetime: { type: Boolean, default: false },
}, { timestamps: true });
export const Purchase = mongoose.model<IPurchase>('Purchase', PurchaseSchema);
