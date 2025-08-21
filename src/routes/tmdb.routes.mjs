import { Router } from 'express';
import { requireAccount } from '../middlewares/auth.mjs';
import { searchTmdb, importFromTmdb } from '../controllers/tmdbController.mjs';

const r = Router();

r.get('/search', requireAccount, searchTmdb);
r.post('/import/:tmdbId', requireAccount, importFromTmdb); // opcional: requireRole('owner','admin')

export default r;