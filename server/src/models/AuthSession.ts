import mongoose, { Document, Schema } from 'mongoose';
export interface IAuthSession extends Document { userId: mongoose.Types.ObjectId; tokenHash: string; expiresAt: Date; }
const AuthSessionSchema = new Schema<IAuthSession>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  tokenHash: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true, expires: 0 },
}, { timestamps: true });
export const AuthSession = mongoose.model<IAuthSession>('AuthSession', AuthSessionSchema);
