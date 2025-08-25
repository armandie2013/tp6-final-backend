export function notFound(req, res, next) {
  res.status(404).json({ error: 'Not found' });
}

// Si tirás errores con `throw new Error('mensaje')`, entran acá.
export function errorHandler(err, req, res, next) {
  const message = err?.message || 'Error interno';
  // Si algún servicio setea `e.status = 409` o 400, lo respetamos.
  const status = err?.status || 400;
  res.status(status).json({ error: message });
}