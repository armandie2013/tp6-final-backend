import { Router } from 'express';
import { requireAccount } from '../middlewares/auth.mjs';
import {
  listProfiles, createProfile, updateProfile, deleteProfile
} from '../controllers/profileController.mjs';

const r = Router();

r.get('/', requireAccount, listProfiles);
r.post('/', requireAccount, createProfile);
r.put('/:id', requireAccount, updateProfile);
r.delete('/:id', requireAccount, deleteProfile);

export default r;