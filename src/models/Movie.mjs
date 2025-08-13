import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title:     { type: String, required: true, index: 'text' },
  year:      { type: Number },
  overview:  { type: String },
  genres:    { type: [String], index: true },
  rating:    { type: Number, default: 0 }, // promedio local o TMDb más adelante
  ageRating: { type: String, default: 'PG-13' } // control local
}, { timestamps: true });

export default mongoose.model('Movie', movieSchema);