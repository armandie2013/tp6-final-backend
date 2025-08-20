import { Router } from 'express';
import { requireAccount } from '../middlewares/auth.mjs';
import { getWatchlist, postWatchlist, deleteWatchlistById, deleteWatchlistByPair } from '../controllers/watchlistController.mjs';

const r = Router();

r.get('/', requireAccount, getWatchlist);          
r.post('/', requireAccount, postWatchlist);        
r.delete('/:id', requireAccount, deleteWatchlistById);
r.delete('/', requireAccount, deleteWatchlistByPair);

export default r;