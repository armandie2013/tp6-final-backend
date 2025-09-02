import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.mjs';
import { env } from '../config/env.mjs';

// Helpers
function normalizeRoles(user) {
  // Soporta user.roles (array) o user.role (string) y devuelve array
  if (Array.isArray(user?.roles) && user.roles.length) return user.roles;
  if (user?.role) return [user.role];
  return ['user'];
}

function signToken(user) {
  const roles = normalizeRoles(user);
  const payload = {
    sub: user._id.toString(),
    roles,          // ← array real
    role: roles[0], // ← compat para front que mira "role"
  };
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '7d' });
}

// REGISTRO: primer usuario = owner; demás = user
export async function registerUser({ email, password }) {
  if (!email || !password) throw new Error('Email y password requeridos');

  const exists = await User.findOne({ email });
  if (exists) throw new Error('Email ya registrado');

  const passwordHash = await bcrypt.hash(password, 10);

  const count = await User.countDocuments();        // 👈 chequeo primer usuario
  const roles = count === 0 ? ['owner'] : ['user']; // 👈 solo el primero es owner

  const user = await User.create({ email, passwordHash, roles });
  return { _id: user._id, email: user.email, roles: user.roles };
}

// LOGIN: devuelve token con roles[] y role
export async function loginUser({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Credenciales inválidas');

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new Error('Credenciales inválidas');

  const token = signToken(user);
  return { token };
}