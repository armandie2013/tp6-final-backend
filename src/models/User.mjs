import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    // Dejamos vacío; el servicio decide si es owner o user
    roles: { type: [String], enum: ['owner','admin','user'], default: undefined },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);