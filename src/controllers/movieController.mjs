import { listMovies, getMovie, createMovie, updateMovie, deleteMovie } from '../services/movieService.mjs';

export async function getMovies(req, res) {
  const data = await listMovies(req.query);
  res.json(data);
}

export async function getMovieById(req, res) {
  const movie = await getMovie(req.params.id);
  if (!movie) return res.status(404).json({ error: 'No encontrada' });
  res.json(movie);
}

// Admin (protegidas)
export async function postMovie(req, res) {
  const movie = await createMovie(req.body);
  res.status(201).json(movie);
}

export async function putMovie(req, res) {
  try {
    const movie = await updateMovie(req.params.id, req.body);
    res.json(movie);
  } catch (e) {
    res.status(404).json({ error: e.message || 'No encontrada' });
  }
}

export async function deleteMovieById(req, res) {
  try {
    await deleteMovie(req.params.id);
    res.json({ ok: true });
  } catch (e) {
    res.status(404).json({ error: e.message || 'No encontrada' });
  }
}