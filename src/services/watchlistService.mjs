import mongoose from 'mongoose';
import Watchlist from '../models/Watchlist.mjs';
import Profile from '../models/Profile.mjs';
import Movie from '../models/Movie.mjs';

const { isValidObjectId } = mongoose;

// Helpers opcionales para mejores errores 400
function assertObjectId(id, name) {
  if (!isValidObjectId(id)) throw new Error(`${name} inválido`);
}

// Asegura que el perfil pertenece a la cuenta del token
async function assertProfileOwner(userId, profileId) {
  const profile = await Profile.findOne({ _id: profileId, userId });
  if (!profile) throw new Error('Perfil no encontrado o no pertenece al usuario');
  return profile;
}

export async function addToWatchlist(userId, { profileId, movieId }) {
  if (!profileId || !movieId) throw new Error('profileId y movieId requeridos');

  // Validaciones básicas de ID (evitan CastError feo)
  assertObjectId(profileId, 'profileId');
  assertObjectId(movieId, 'movieId');

  // Verificar que el perfil es del usuario
  const profile = await assertProfileOwner(userId, profileId);

  // Cargar película (necesitamos el ageRating)
  const movie = await Movie.findById(movieId).lean();
  if (!movie) throw new Error('Película inexistente');

  // Gate: si el perfil es "kid", solo permitir G o PG
  if (profile.type === 'kid') {
    const allowed = ['G', 'PG'];
    if (!allowed.includes(movie.ageRating)) {
      throw new Error('Contenido no apto para perfil niño');
    }
  }

  try {
    // Índice único (profileId, movieId) evita duplicados
    const item = await Watchlist.create({ profileId, movieId });
    return item;
  } catch (e) {
    if (e?.code === 11000) throw new Error('La película ya está en la watchlist');
    throw e;
  }
}

export async function listWatchlist(userId, { profileId, page = 1, limit = 24, populate = true }) {
  if (!profileId) throw new Error('profileId requerido');
  assertObjectId(profileId, 'profileId');

  await assertProfileOwner(userId, profileId);

  page = Math.max(1, parseInt(page, 10));
  limit = Math.min(50, Math.max(1, parseInt(limit, 10)));
  const skip = (page - 1) * limit;

  const q = { profileId };

  const [docs, total] = await Promise.all([
    (populate
      ? Watchlist.find(q)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate('movieId', 'title year genres rating ageRating')
      : Watchlist.find(q)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
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

  if (id) {
    assertObjectId(id, 'id');
  } else {
    assertObjectId(profileId, 'profileId');
    assertObjectId(movieId, 'movieId');
    await assertProfileOwner(userId, profileId);
  }

  const filter = id ? { _id: id } : { profileId, movieId };
  const deleted = await Watchlist.findOneAndDelete(filter);
  if (!deleted) throw new Error('Item no encontrado');
  return true;
}