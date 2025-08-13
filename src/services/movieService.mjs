import Movie from '../models/Movie.mjs';

function buildPagination(query) {
  const page  = Math.max(1, parseInt(query.page ?? '1', 10));
  const limit = Math.min(50, Math.max(1, parseInt(query.limit ?? '24', 10)));
  const skip  = (page - 1) * limit;
  return { page, limit, skip };
}

function buildFilters(q) {
  const filter = {};
  if (q.search) filter.$text = { $search: q.search };
  if (q.genre)  filter.genres = q.genre;
  if (q.year)   filter.year   = Number(q.year);
  return filter;
}

export async function listMovies(query = {}) {
  const { page, limit, skip } = buildPagination(query);
  const filter = buildFilters(query);

  const [docs, total] = await Promise.all([
    Movie.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Movie.countDocuments(filter)
  ]);

  return {
    docs,
    page,
    totalDocs: total,
    totalPages: Math.ceil(total / limit)
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