// requireRole(...allowed): chequea req.auth.roles (o req.auth.role) y permite pasar si hay intersección con los roles permitidos; si no, 403.
export function requireRole(...allowed) {
  return (req, res, next) => {
    const roles = Array.isArray(req.auth?.roles)
      ? req.auth.roles
      : (req.auth?.role ? [req.auth.role] : []);
    if (roles.some(r => allowed.includes(r))) return next();
    return res.status(403).json({ error: 'Permisos insuficientes' });
  };
}