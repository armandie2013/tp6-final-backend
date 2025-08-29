import {
  listMovies,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie
} from '../services/movieService.mjs';

import {
  badRequest,
  isNonEmptyString,
  isEnum,
  toInt,
  isRating,
  isYear,
  isObjectId
} from '../utils/validators.mjs';

const AGE_RATINGS = ['G', 'PG', 'PG-13', 'R', 'NC-17'];

// GET /movies
export async function getMovies(req, res, next) {
  try {
    const data = await listMovies(req.query, req.auth?.sub);
    res.json(data);
  } catch (e) { next(e); }
}

// GET /movies/:id
export async function getMovieById(req, res, next) {
  try {
    const { id } = req.params;
    if (!isObjectId(id)) throw badRequest('id inválido');

    const movie = await getMovie(id);
    if (!movie) throw badRequest('Película no encontrada');
    res.json(movie);
  } catch (e) { next(e); }
}

// POST /movies  (owner/admin)
export async function postMovie(req, res, next) {
  try {
    const { title, year, genres, rating, ageRating, overview, poster, tmdbId } = req.body;

    if (!isNonEmptyString(title)) throw badRequest('title requerido');

    const payload = { title: title.trim() };

    if (year !== undefined) {
      const y = toInt(year, null);
      if (y === null || !isYear(y)) throw badRequest('year inválido');
      payload.year = y;
    }

    if (genres !== undefined) {
      if (!Array.isArray(genres) || !genres.every(isNonEmptyString)) {
        throw badRequest('genres inválido (array de strings)');
      }
      payload.genres = genres.map(g => g.trim());
    }

    if (rating !== undefined) {
      const r = Number(rating);
      if (Number.isNaN(r) || !isRating(r)) throw badRequest('rating inválido (0-10)');
      payload.rating = r;
    }

    if (ageRating !== undefined) {
      if (!isEnum(ageRating, AGE_RATINGS)) throw badRequest(`ageRating inválido (${AGE_RATINGS.join(', ')})`);
      payload.ageRating = ageRating;
    }

    if (overview !== undefined) payload.overview = String(overview ?? '');
    if (poster !== undefined)   payload.poster   = String(poster ?? '');
    if (tmdbId !== undefined)   payload.tmdbId   = Number(tmdbId);

    const movie = await createMovie(payload);
    res.status(201).json(movie);
  } catch (e) { next(e); }
}

// PUT /movies/:id  (owner/admin)
export async function putMovie(req, res, next) {
  try {
    const { id } = req.params;
    if (!isObjectId(id)) throw badRequest('id inválido');

    const { title, year, genres, rating, ageRating, overview, poster } = req.body;
    const data = {};

    if (title !== undefined) {
      if (!isNonEmptyString(title)) throw badRequest('title inválido');
      data.title = title.trim();
    }

    if (year !== undefined) {
      const y = toInt(year, null);
      if (y === null || !isYear(y)) throw badRequest('year inválido');
      data.year = y;
    }

    if (genres !== undefined) {
      if (!Array.isArray(genres) || !genres.every(isNonEmptyString)) {
        throw badRequest('genres inválido (array de strings)');
      }
      data.genres = genres.map(g => g.trim());
    }

    if (rating !== undefined) {
      const r = Number(rating);
      if (Number.isNaN(r) || !isRating(r)) throw badRequest('rating inválido (0-10)');
      data.rating = r;
    }

    if (ageRating !== undefined) {
      if (!isEnum(ageRating, AGE_RATINGS)) throw badRequest(`ageRating inválido (${AGE_RATINGS.join(', ')})`);
      data.ageRating = ageRating;
    }

    if (overview !== undefined) data.overview = String(overview ?? '');
    if (poster !== undefined)   data.poster   = String(poster ?? '');

    const movie = await updateMovie(id, data);
    res.json(movie);
  } catch (e) { next(e); }
}

// DELETE /movies/:id  (owner/admin)
export async function deleteMovieById(req, res, next) {
  try {
    const { id } = req.params;
    if (!isObjectId(id)) throw badRequest('id inválido');

    await deleteMovie(id);
    res.json({ ok: true });
  } catch (e) { next(e); }
}