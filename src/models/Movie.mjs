import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  // Identificador de TMDb (si la importás de la API externa)
  tmdbId:   { type: Number, index: true, unique: true, sparse: true },

  title:    { type: String, required: true, trim: true },
  year:     { type: Number },

  overview: { type: String, default: '' },
  poster:   { type: String, default: '' },

  genres:   { type: [String], default: [], index: true },
  rating:   { type: Number, default: 0 }, // rating promedio local o TMDb
  ageRating:{ type: String, enum: ['G','PG','PG-13','R','NC-17'], default: 'PG-13' }
}, { timestamps: true });

// índice de texto para búsqueda (en título + overview)
movieSchema.index({ title: 'text', overview: 'text' });

export default mongoose.model('Movie', movieSchema);