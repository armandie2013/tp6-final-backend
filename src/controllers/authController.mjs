import { registerUser, loginUser } from '../services/authService.mjs';

export async function register(req, res) {
  try {
    const user = await registerUser(req.body);
    return res.status(201).json({ message: 'Registrado', userId: user._id });
  } catch (e) {
    const msg = e.message?.includes('ya registrado') ? e.message : (e.message || 'Error al registrar');
    const code = e.message?.includes('ya registrado') ? 409 : 400;
    return res.status(code).json({ error: msg });
  }
}

export async function login(req, res) {
  try {
    const data = await loginUser(req.body);
    return res.json(data);
  } catch (e) {
    return res.status(401).json({ error: e.message || 'Error al iniciar sesión' });
  }
}