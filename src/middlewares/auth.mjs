import jwt from 'jsonwebtoken';
import { env } from '../config/env.mjs';

function extractToken(req) {
  const auth = req.headers.authorization || '';
  const [, token] = auth.split(' ');
  return token;
}

export function requireAccount(req, res, next) {
  const token = extractToken(req);
  if (!token) return res.status(401).json({ error: 'Token requerido' });
  try {
    const payload = jwt.verify(token, env.JWT_SECRET); // { sub, role }
    req.auth = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
}