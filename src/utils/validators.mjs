import mongoose from 'mongoose';
const { isValidObjectId } = mongoose;

export const isEmail = (s) => typeof s === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
export const isNonEmptyString = (s) => typeof s === 'string' && s.trim().length > 0;
export const isEnum = (s, arr) => arr.includes(s);
export const toInt = (v, def = null) => Number.isInteger(Number(v)) ? Number(v) : def;
export const isRating = (n) => typeof n === 'number' && n >= 0 && n <= 10;
export const isYear = (y) => Number.isInteger(y) && y >= 1900 && y <= 2100;
export const isObjectId = (id) => isValidObjectId(id);

export function badRequest(msg) {
  const e = new Error(msg);
  e.status = 400;
  return e;
}