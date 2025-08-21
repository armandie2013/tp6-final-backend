import { env } from '../config/env.mjs';

const TMDB_BASE = 'https://api.themoviedb.org/3';

async function tmdbFetch(path, params = {}) {
  if (!env.TMDB_ACCESS_TOKEN) throw new Error('Falta TMDB_ACCESS_TOKEN');

  const url = new URL(`${TMDB_BASE}${path}`);
  // Si quisieras usar v3 api_key, sería: url.searchParams.set('api_key', env.TMDB_API_KEY);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${env.TMDB_ACCESS_TOKEN}`,
      'Accept': 'application/json'
    }
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`TMDb ${res.status}: ${text || res.statusText}`);
  }
  return res.json();
}

export async function tmdbSearch(query, page = 1) {
  if (!query) throw new Error('query requerido');
  const data = await tmdbFetch('/search/movie', { query, page, language: 'es-ES' });
  return data.results.map(r => ({
    tmdbId: r.id,
    title: r.title,
    year: r.release_date ? Number(r.release_date.slice(0, 4)) : null,
    overview: r.overview,
    poster: r.poster_path ? `https://image.tmdb.org/t/p/w342${r.poster_path}` : null,
    rating: r.vote_average ?? 0
  }));
}

export async function tmdbGetMovie(tmdbId) {
  const details = await tmdbFetch(`/movie/${tmdbId}`, { language: 'es-ES' });
  return {
    tmdbId: details.id,
    title: details.title,
    year: details.release_date ? Number(details.release_date.slice(0, 4)) : null,
    overview: details.overview || '',
    poster: details.poster_path ? `https://image.tmdb.org/t/p/w500${details.poster_path}` : null,
    genres: (details.genres || []).map(g => g.name),
    rating: details.vote_average ?? 0
  };
}