import { Router } from 'express';
import { requireAccount } from '../middlewares/auth.mjs';
import { getMovies, getMovieById, postMovie, putMovie, deleteMovieById } from '../controllers/movieController.mjs';

const r = Router();

// Listado y detalle (protegidos para ser consistentes con tu TP)
r.get('/', requireAccount, getMovies);
r.get('/:id', requireAccount, getMovieById);

// Admin CRUD (mismo token de login)
r.post('/', requireAccount, postMovie);
r.put('/:id', requireAccount, putMovie);
r.delete('/:id', requireAccount, deleteMovieById);

export default r;