import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name:    { type: String, required: true, trim: true },
  type:    { type: String, enum: ['adult', 'kid'], default: 'adult' },
  avatar:  { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('Profile', profileSchema);