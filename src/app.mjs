import express from 'express';
import cors from 'cors';
import { env } from './config/env.mjs';
import { connectDB } from './config/db.mjs';

// IMPORTS DE RUTAS
import authRoutes from './routes/auth.routes.mjs';
import profileRoutes from './routes/profiles.routes.mjs';
import moviesRoutes from './routes/movies.routes.mjs';

const app = express();
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json());

// Healthcheck
app.get('/', (req, res) => res.json({ ok: true, name: 'Nodo Cine API (MVC)' }));

// 👉 montar rutas ANTES del 404
app.use('/auth', authRoutes);
app.use('/profiles', profileRoutes);
app.use('/movies', moviesRoutes);

// 404
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// Arranque
connectDB()
  .then(() => app.listen(env.PORT, () => console.log(`🟢 Server http://localhost:${env.PORT}`)))
  .catch(err => { console.error('❌ Error DB:', err.message); process.exit(1); });