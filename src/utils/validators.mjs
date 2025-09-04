import mongoose from 'mongoose';
const { isValidObjectId } = mongoose;


//Validadores comunes: isEmail, isNonEmptyString, isEnum, toInt, isRating, isYear, isObjectId.
export const isEmail = (s) => typeof s === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
export const isNonEmptyString = (s) => typeof s === 'string' && s.trim().length > 0;
export const isEnum = (s, arr) => arr.includes(s);
export const toInt = (v, def = null) => Number.isInteger(Number(v)) ? Number(v) : def;
export const isRating = (n) => typeof n === 'number' && n >= 0 && n <= 10;
export const isYear = (y) => Number.isInteger(y) && y >= 1900 && y <= 2100;
export const isObjectId = (id) => isValidObjectId(id);


//badRequest(msg): crea Error con status=400 para que lo tome errorHandler.
export function badRequest(msg) {
  const e = new Error(msg);
  e.status = 400;
  return e;
}