import { tmdbSearch, tmdbGetMovie } from '../services/tmdbService.mjs';
import Movie from '../models/Movie.mjs';

function inferAgeRatingFromGenres(genres = []) {
  const lower = genres.map(g => g.toLowerCase());
  if (lower.includes('animation') || lower.includes('family')) return 'G';
  return 'PG-13';
}

export async function searchTmdb(req, res) {
  try {
    const { query, page } = req.query;
    const results = await tmdbSearch(query, page || 1);
    res.json({ results });
  } catch (e) {
    res.status(400).json({ error: e.message || 'Error TMDb search' });
  }
}

export async function importFromTmdb(req, res) {
  try {
    const { tmdbId } = req.params;
    const data = await tmdbGetMovie(tmdbId);

    const doc = await Movie.findOneAndUpdate(
      { tmdbId: data.tmdbId },
      {
        tmdbId: data.tmdbId,
        title: data.title,
        year: data.year,
        overview: data.overview,
        poster: data.poster,
        genres: data.genres,
        rating: data.rating,
        ageRating: inferAgeRatingFromGenres(data.genres)
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json(doc);
  } catch (e) {
    res.status(400).json({ error: e.message || 'Error al importar desde TMDb' });
  }
}