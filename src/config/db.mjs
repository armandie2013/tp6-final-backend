import mongoose from 'mongoose';
import { env } from './env.mjs';

export async function connectDB() {
  if (!env.MONGODB_URI) throw new Error('MONGODB_URI no configurada');
  mongoose.set('strictQuery', true);
  await mongoose.connect(env.MONGODB_URI);
  console.log('✅ Conectado a MongoDB');
}