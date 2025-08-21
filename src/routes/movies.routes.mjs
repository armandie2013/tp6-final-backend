import { Router } from 'express';
import { requireAccount } from '../middlewares/auth.mjs';
import { requireRole } from '../middlewares/roles.mjs';
import { getMovies, getMovieById, postMovie, putMovie, deleteMovieById } from '../controllers/movieController.mjs';

const r = Router();

// Listado y detalle (protegidos para ser consistentes con tu TP)
r.get('/', requireAccount, getMovies);
r.get('/:id', requireAccount, getMovieById);

// CRUD solo para owner/admin
r.post('/', requireAccount, requireRole('owner', 'admin'), postMovie);
r.put('/:id', requireAccount, requireRole('owner', 'admin'), putMovie);
r.delete('/:id', requireAccount, requireRole('owner', 'admin'), deleteMovieById);

export default r;