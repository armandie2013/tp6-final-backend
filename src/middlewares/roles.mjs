export function requireRole(...allowed) {
  return (req, res, next) => {
    const roles = Array.isArray(req.auth?.roles)
      ? req.auth.roles
      : (req.auth?.role ? [req.auth.role] : []);
    if (roles.some(r => allowed.includes(r))) return next();
    return res.status(403).json({ error: 'Permisos insuficientes' });
  };
}