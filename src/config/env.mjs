import 'dotenv/config';

export const env = {
  PORT: process.env.PORT || 4000,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET || 'change-me',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
};