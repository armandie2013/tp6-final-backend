import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.mjs';
import { env } from '../config/env.mjs';

export async function registerUser({ email, password }) {
  if (!email || !password) throw new Error('Email y password requeridos');
  const exists = await User.findOne({ email });
  if (exists) throw new Error('Email ya registrado');
  const passwordHash = await bcrypt.hash(password, 10);
  return User.create({ email, passwordHash });
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Credenciales inválidas');
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new Error('Credenciales inválidas');
  const token = jwt.sign({ sub: user._id.toString(), role: 'owner' }, env.JWT_SECRET, { expiresIn: '7d' });
  return { token };
}