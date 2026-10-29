import mongoose from 'mongoose';

export async function connectDatabase(): Promise<boolean> {
  const uri = process.env.MONGODB_URI?.trim();

  if (!uri || uri === 'your_mongodb_connection_string') {
    console.log('[Database] No MONGODB_URI provided. Running in resilient local storage mode.');
    return false;
  }

  try {
    console.log('[Database] Connecting to MongoDB Atlas...');
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('[Database] Successfully connected to MongoDB Atlas.');
    return true;
  } catch (err: any) {
    console.warn(`[Database] MongoDB Atlas connection warning: ${err?.message || err}. Continuing in resilient fallback mode.`);
    return false;
  }
}
