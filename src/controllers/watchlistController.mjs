import { addToWatchlist, listWatchlist, removeFromWatchlist } from '../services/watchlistService.mjs';

export async function getWatchlist(req, res) {
  try {
    const { profileId, page, limit, populate } = req.query;
    const data = await listWatchlist(req.auth.sub, { profileId, page, limit, populate: populate !== 'false' });
    res.json(data);
  } catch (e) {
    res.status(400).json({ error: e.message || 'Error al listar watchlist' });
  }
}

export async function postWatchlist(req, res) {
  try {
    const item = await addToWatchlist(req.auth.sub, req.body); // { profileId, movieId }
    res.status(201).json(item);
  } catch (e) {
    const code = e.message?.includes('ya está en la watchlist') ? 409 : 400;
    res.status(code).json({ error: e.message || 'Error al agregar a watchlist' });
  }
}

// DELETE /watchlist/:id
export async function deleteWatchlistById(req, res) {
  try {
    await removeFromWatchlist(req.auth.sub, { id: req.params.id });
    res.json({ ok: true });
  } catch (e) {
    res.status(404).json({ error: e.message || 'Error al eliminar de watchlist' });
  }
}

// DELETE /watchlist  (profileId + movieId en query o body)
export async function deleteWatchlistByPair(req, res) {
  try {
    const { profileId, movieId } = Object.keys(req.query).length ? req.query : req.body;
    await removeFromWatchlist(req.auth.sub, { profileId, movieId });
    res.json({ ok: true });
  } catch (e) {
    res.status(404).json({ error: e.message || 'Error al eliminar de watchlist' });
  }
}