import mongoose from 'mongoose';

const watchlistSchema = new mongoose.Schema({
  profileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true, index: true },
  movieId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true, index: true }
}, { timestamps: true });

// Evita duplicar una misma movie en la misma watchlist de un perfil
watchlistSchema.index({ profileId: 1, movieId: 1 }, { unique: true });

export default mongoose.model('Watchlist', watchlistSchema);