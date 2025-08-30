const TMDB_BASE = "https://api.themoviedb.org/3";

function authHeaders() {
  const token = process.env.TMDB_ACCESS_TOKEN;
  if (!token) throw new Error("Falta TMDB_ACCESS_TOKEN");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json;charset=utf-8",
  };
}

export async function tmdbFetch(path, params = {}) {
  const qs = new URLSearchParams(params);
  const url = `${TMDB_BASE}${path}${qs.toString() ? `?${qs}` : ""}`;
  const res = await fetch(url, { headers: authHeaders() });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`TMDb ${res.status}: ${body || res.statusText}`);
  }
  return res.json();
}

export async function tmdbSearch(query) {
  const data = await tmdbFetch("/search/movie", {
    query,
    include_adult: false,
    language: "es-ES",
    page: 1,
  });

  const list = Array.isArray(data?.results) ? data.results : [];
  // Normalizamos campos mínimos que usa el front
  return list.map((r) => ({
    id: r.id,
    tmdbId: r.id,
    title: r.title,
    name: r.title,
    release_date: r.release_date,
    poster_path: r.poster_path,
    image: r.poster_path, // por compatibilidad
    adult: !!r.adult,
  }));
}

export async function tmdbGetMovie(tmdbId) {
  // Trae detalle (sumá append_to_response si necesitás más info)
  return tmdbFetch(`/movie/${tmdbId}`, { language: "es-ES" });
}

// ✅ certificación oficial (ageRating) según prioridad de países
export async function tmdbGetCertification(
  tmdbId,
  countryPriority = ["AR", "US", "ES"]
) {
  const rel = await tmdbFetch(`/movie/${tmdbId}/release_dates`);
  const results = rel?.results || [];

  // primero: países preferidos
  for (const c of countryPriority) {
    const entry = results.find((r) => r.iso_3166_1 === c);
    if (entry && Array.isArray(entry.release_dates)) {
      const hit = entry.release_dates.find(
        (d) => d.certification && d.certification.trim().length > 0
      );
      if (hit) return hit.certification.trim();
    }
  }

  // fallback: primera certificación no vacía de cualquier país
  for (const r of results) {
    if (Array.isArray(r.release_dates)) {
      const hit = r.release_dates.find(
        (d) => d.certification && d.certification.trim().length > 0
      );
      if (hit) return hit.certification.trim();
    }
  }
  return "";
}