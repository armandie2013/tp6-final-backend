import Watchlist from '../models/Watchlist.mjs';
import Profile from '../models/Profile.mjs';
import Movie from '../models/Movie.mjs';

// Asegura que el perfil pertenece a la cuenta del token
async function assertProfileOwner(userId, profileId) {
  const profile = await Profile.findOne({ _id: profileId, userId });
  if (!profile) throw new Error('Perfil no encontrado o no pertenece al usuario');
  return profile;
}

export async function addToWatchlist(userId, { profileId, movieId }) {
  if (!profileId || !movieId) throw new Error('profileId y movieId requeridos');

  await assertProfileOwner(userId, profileId);

  // (opcional) validar existencia de la película
  const existsMovie = await Movie.exists({ _id: movieId });
  if (!existsMovie) throw new Error('Película inexistente');

  try {
    const item = await Watchlist.create({ profileId, movieId });
    return item;
  } catch (e) {
    if (e?.code === 11000) throw new Error('La película ya está en la watchlist');
    throw e;
  }
}

export async function listWatchlist(userId, { profileId, page = 1, limit = 24, populate = true }) {
  if (!profileId) throw new Error('profileId requerido');

  await assertProfileOwner(userId, profileId);

  page = Math.max(1, parseInt(page, 10));
  limit = Math.min(50, Math.max(1, parseInt(limit, 10)));
  const skip = (page - 1) * limit;

  const q = { profileId };

  const [docs, total] = await Promise.all([
    (populate
      ? Watchlist.find(q).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('movieId', 'title year genres rating ageRating')
      : Watchlist.find(q).sort({ createdAt: -1 }).skip(skip).limit(limit)
    ),
    Watchlist.countDocuments(q)
  ]);

  return {
    docs,
    page,
    totalDocs: total,
    totalPages: Math.ceil(total / limit)
  };
}

export async function removeFromWatchlist(userId, { id, profileId, movieId }) {
  // Se puede borrar por id del item o por (profileId + movieId)
  if (!id && (!profileId || !movieId)) throw new Error('id o (profileId y movieId) requeridos');

  if (profileId) await assertProfileOwner(userId, profileId);

  const filter = id ? { _id: id } : { profileId, movieId };
  const deleted = await Watchlist.findOneAndDelete(filter);
  if (!deleted) throw new Error('Item no encontrado');
  return true;
}