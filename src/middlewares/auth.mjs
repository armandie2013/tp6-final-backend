import jwt from 'jsonwebtoken';
import { env } from '../config/env.mjs';

function extractToken(req) {
  const auth = req.headers.authorization || '';
  const [, token] = auth.split(' ');
  return token;
}

//requireAccount: extrae Bearer token del header Authorization, 
// verifica con JWT_SECRET, y coloca el payload en req.auth (p. ej. { sub, role | roles }). 
// Si falta o es inválido → 401.
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