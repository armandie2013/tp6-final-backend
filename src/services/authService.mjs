import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.mjs";
import { env } from "../config/env.mjs";

// Helpers
//Se asegura de que siempre trabajes con un array de roles aunque el User tenga guardado un único role como string.

//Casos:
//Si user.roles existe y es array → lo devuelve.
//Si solo tiene user.role (string) → lo convierte en array de un elemento.
//Si no hay nada → devuelve ["user"] como default.
//Esto evita errores cuando firmás el token o chequeás permisos.


function normalizeRoles(user) {
  // Soporta user.roles (array) o user.role (string) y devuelve array
  if (Array.isArray(user?.roles) && user.roles.length) return user.roles;
  if (user?.role) return [user.role];
  return ["user"];
}


// signToken(user)
// Recibe un objeto User ya validado.
// Llama a normalizeRoles para unificar roles.
// Construye un payload JWT con:
// sub: el _id del usuario en string.
// roles: array real de roles.
// role: primer rol del array (para compatibilidad con el front).
// Firma ese payload con jwt.sign, usando la JWT_SECRET del .env.
// Devuelve un token válido por 7 días.
// Es la pieza que asegura autenticación stateless en el backend.

function signToken(user) {
  const roles = normalizeRoles(user);
  const payload = {
    sub: user._id.toString(),
    roles, // ← array real
    role: roles[0], // ← compat para front que mira "role"
  };
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });
}


// registerUser({ email, password })
// Valida que email y password no estén vacíos.
// Busca en Mongo si ya existe un usuario con ese email → si existe, tira error (409).
// Hashea el password con bcrypt.hash(..., 10) y guarda en passwordHash.
// Cuenta cuántos usuarios hay (User.countDocuments()):
// Si es el primer usuario, le da rol ["owner"].
// Si no, asigna ["user"].
// Crea el nuevo usuario en la colección User.
// Devuelve solo datos básicos: { _id, email, roles }.
// Sirve para registro inicial y controla el rol especial del primer usuario.

// REGISTRO: primer usuario = owner; demás = user
export async function registerUser({ email, password }) {
  if (!email || !password) throw new Error("Email y password requeridos");

  //Verifica si existe User con ese email, si existe lanza error 409.
  const exists = await User.findOne({ email });
  if (exists) throw new Error("Email ya registrado");

  //Hashea password con bcrypt → passwordHash.
  const passwordHash = await bcrypt.hash(password, 10);

  const count = await User.countDocuments(); // 👈 chequeo primer usuario  
  const roles = count === 0 ? ["owner"] : ["user"]; // 👈 solo el primero es owner

  const user = await User.create({ email, passwordHash, roles });
  return { _id: user._id, email: user.email, roles: user.roles };
}


// loginUser({ email, password })
// Busca en Mongo un usuario por email.
// Si no existe, lanza error "Credenciales inválidas".
// Compara la contraseña en texto plano con bcrypt.compare contra el passwordHash guardado.
// Si no coincide, también lanza "Credenciales inválidas".
// Si todo está bien, genera un token con signToken(user).
// Devuelve { token }.
// Es el flujo de login: validar credenciales y entregar un JWT firmado con los roles del usuario.
// LOGIN: devuelve token con roles[] y role
export async function loginUser({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Credenciales inválidas");

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new Error("Credenciales inválidas");

  const token = signToken(user);
  return { token };
}
