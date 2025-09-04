import express from 'express';
import cors from 'cors';
import { env } from './config/env.mjs';
import { connectDB } from './config/db.mjs';

// IMPORTS DE RUTAS
import authRoutes from './routes/auth.routes.mjs';
import profileRoutes from './routes/profiles.routes.mjs';
import moviesRoutes from './routes/movies.routes.mjs';
import watchlistRoutes from './routes/watchlist.routes.mjs';
import tmdbRoutes from './routes/tmdb.routes.mjs';

import { notFound, errorHandler } from './middlewares/errors.mjs';

const app = express();

// Configuramos CORS con origin
app.use(cors({
  origin: env.CORS_ORIGIN?.split(',') || '*',  // lista separada por comas en .env
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

app.use(express.json());

// Healthcheck
app.get('/', (req, res) => res.json({ ok: true, name: 'Modelo-tp6-backend' }));

// Montamos las rutas ANTES del 404
app.use('/auth', authRoutes);
app.use('/profiles', profileRoutes);
app.use('/movies', moviesRoutes);
app.use('/watchlist', watchlistRoutes);
app.use('/tmdb', tmdbRoutes);

// Middlewares de error
app.use(notFound);
app.use(errorHandler);

// 404
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// Arranque
connectDB()
  .then(() => app.listen(env.PORT, () => 
    console.log(`🟢 Server http://localhost:${env.PORT}`)
  ))
  .catch(err => { 
    console.error('❌ Error DB:', err.message); 
    process.exit(1); 
  });