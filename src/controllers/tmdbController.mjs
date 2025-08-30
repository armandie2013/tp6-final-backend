import Movie from "../models/Movie.mjs";
import {
  tmdbSearch,
  tmdbGetMovie,
  tmdbGetCertification,
} from "../services/tmdbService.mjs";

// GET /tmdb/search?query=matrix  (también acepta ?q=)
export async function searchTmdb(req, res) {
  try {
    const q = (req.query.q ?? req.query.query ?? "").trim();
    if (!q) return res.status(400).json({ error: "query requerido" });

    const results = await tmdbSearch(q);

    // ✅ enriquecer los primeros N con ageRating real para no exceder rate limits
    const N = Math.min(results.length, 12);
    await Promise.all(
      results.slice(0, N).map(async (r, idx) => {
        try {
          const cert = await tmdbGetCertification(r.tmdbId);
          if (cert) results[idx] = { ...r, ageRating: cert };
        } catch {
          /* noop */
        }
      })
    );

    res.json(results);
  } catch (e) {
    res.status(500).json({ error: e.message || "Error buscando en TMDb" });
  }
}

// POST /tmdb/import/:tmdbId
export async function importFromTmdb(req, res) {
  try {
    const tmdbId = Number(req.params.tmdbId);
    if (!tmdbId) return res.status(400).json({ error: "tmdbId inválido" });

    const data = await tmdbGetMovie(tmdbId);
    const cert = await tmdbGetCertification(tmdbId);

    // upsert por tmdbId si lo guardás; si no, podés usar (title+year) como clave
    const doc = await Movie.findOneAndUpdate(
      { tmdbId },
      {
        tmdbId,
        title: data.title,
        year: data.release_date ? Number(data.release_date.slice(0, 4)) : undefined,
        genres: Array.isArray(data.genres) ? data.genres.map((g) => g.name).filter(Boolean) : [],
        poster: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : undefined,
        overview: data.overview,
        // ✅ guardar certificación si existe; si no, no pisar (queda vacío por defecto)
        ...(cert ? { ageRating: cert } : {}),
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json(doc);
  } catch (e) {
    res.status(500).json({ error: e.message || "Error importando desde TMDb" });
  }
}