// import Movie from '../models/Movie.mjs';
// import Profile from '../models/Profile.mjs';

// function buildPagination(query) {
//   const page  = Math.max(1, parseInt(query.page ?? '1', 10));
//   const limit = Math.min(50, Math.max(1, parseInt(query.limit ?? '24', 10)));
//   const skip  = (page - 1) * limit;
//   return { page, limit, skip };
// }

// function buildFilters(q) {
//   const filter = {};
//   if (q.search) filter.$text = { $search: q.search };
//   if (q.genre)  filter.genres = q.genre;
//   if (q.year)   filter.year   = Number(q.year);
//   return filter;
// }


// export async function listMovies(query = {}, userId) {
//   const { page, limit, skip } = buildPagination(query);
//   const filter = buildFilters(query);

//   // Gate por perfil niño (opcional si viene profileId)
//   if (query.profileId && userId) {
//     const profile = await Profile.findOne({ _id: query.profileId, userId });
//     if (profile && profile.type === 'kid') {
//       const allowed = ['G', 'PG']; // ajustá tu política si querés
//       filter.ageRating = { $in: allowed };
//     }
//   }

//   const [docs, total] = await Promise.all([
//     Movie.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
//     Movie.countDocuments(filter)
//   ]);

//   return {
//     docs,
//     page,
//     totalDocs: total,
//     totalPages: Math.ceil(total / limit)
//   };
// }

// export function getMovie(id) {
//   return Movie.findById(id);
// }

// export function createMovie(data) {
//   return Movie.create(data);
// }

// export async function updateMovie(id, data) {
//   const updated = await Movie.findByIdAndUpdate(id, data, { new: true });
//   if (!updated) throw new Error('Película no encontrada');
//   return updated;
// }

// export async function deleteMovie(id) {
//   const deleted = await Movie.findByIdAndDelete(id);
//   if (!deleted) throw new Error('Película no encontrada');
//   return true;
// }

// services/movies.service.mjs
import Movie from '../models/Movie.mjs';
import Profile from '../models/Profile.mjs';

/* ------------------------ helpers ------------------------ */
function escapeRegex(str = '') {
  // escapa caracteres especiales para construir un RegExp seguro
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildPagination(query) {
  const page  = Math.max(1, parseInt(query.page ?? '1', 10));
  // default alineado con el front (PER_PAGE = 12)
  const limit = Math.min(50, Math.max(1, parseInt(query.limit ?? '12', 10)));
  const skip  = (page - 1) * limit;
  return { page, limit, skip };
}

function buildFilters(q = {}) {
  const filter = {};

  // --- search por título/overview con regex (sin requerir índice $text)
  const text = (q.search ?? '').toString().trim();
  if (text) {
    const rx = new RegExp(escapeRegex(text), 'i');
    filter.$or = [{ title: rx }, { overview: rx }];
  }

  // --- géneros: acepta uno o varios (coma separados)
  const genre = (q.genre ?? '').toString().trim();
  if (genre) {
    const arr = genre.split(',').map(s => s.trim()).filter(Boolean);
    filter.genres = arr.length > 1 ? { $all: arr } : arr[0];
  }

  // --- año: sólo si es número válido
  if (q.year !== undefined && q.year !== null && q.year !== '') {
    const y = Number(q.year);
    if (!Number.isNaN(y)) filter.year = y;
  }

  return filter;
}

/* ------------------------ services ------------------------ */
export async function listMovies(query = {}, userId) {
  const { page, limit, skip } = buildPagination(query);
  const filter = buildFilters(query);

  // Gate por perfil niño (si viene profileId perteneciente al userId)
  if (query.profileId && userId) {
    const profile = await Profile.findOne({ _id: query.profileId, userId });
    if (profile && profile.type === 'kid') {
      const allowed = ['G', 'PG']; // ajustá tu política si querés
      filter.ageRating = { $in: allowed };
    }
  }

  const [docs, total] = await Promise.all([
    Movie.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Movie.countDocuments(filter),
  ]);

  return {
    docs,
    page,
    totalDocs: total,
    totalPages: Math.ceil(total / limit),
    limit,
  };
}

export function getMovie(id) {
  return Movie.findById(id);
}

export function createMovie(data) {
  return Movie.create(data);
}

export async function updateMovie(id, data) {
  const updated = await Movie.findByIdAndUpdate(id, data, { new: true });
  if (!updated) throw new Error('Película no encontrada');
  return updated;
}

export async function deleteMovie(id) {
  const deleted = await Movie.findByIdAndDelete(id);
  if (!deleted) throw new Error('Película no encontrada');
  return true;
}