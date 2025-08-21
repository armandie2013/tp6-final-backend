import 'dotenv/config';

export const env = {
  PORT: process.env.PORT || 4000,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET || 'change-me',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  TMDB_ACCESS_TOKEN: process.env.TMDB_ACCESS_TOKEN,
  TMDB_API_KEY: process.env.TMDB_API_KEY, // opcional
};