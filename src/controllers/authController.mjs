import { registerUser, loginUser } from '../services/authService.mjs';
import { isEmail, isNonEmptyString, badRequest } from '../utils/validators.mjs';

// POST /auth/register
export async function register(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!isEmail(email)) throw badRequest('Email inválido');
    if (!isNonEmptyString(password) || password.length < 6) {
      throw badRequest('Password mínimo 6 caracteres');
    }

    const user = await registerUser({ email, password });
    res.status(201).json({ message: 'Usuario registrado con éxito', userId: user._id });
  } catch (e) {
    // si preferís mantener tu 409 para "ya registrado", lo respetamos:
    if (e.message?.includes('ya registrado')) {
      e.status = 409;
    }
    next(e);
  }
}

// POST /auth/login
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!isEmail(email)) throw badRequest('Email inválido');
    if (!isNonEmptyString(password)) throw badRequest('Password requerido');

    const data = await loginUser({ email, password });
    res.json(data); // { token }
  } catch (e) {
    // credenciales inválidas -> 401
    if (e.message?.toLowerCase().includes('credenciales')) {
      e.status = 401;
    }
    next(e);
  }
}