import {
  listUserProfiles,
  createUserProfile,
  updateUserProfile,
  deleteUserProfile
} from '../services/profileService.mjs';

export async function listProfiles(req, res) {
  const profiles = await listUserProfiles(req.auth.sub);
  res.json(profiles);
}

export async function createProfile(req, res) {
  try {
    const profile = await createUserProfile(req.auth.sub, req.body);
    res.status(201).json(profile);
  } catch (e) {
    res.status(400).json({ error: e.message || 'Error al crear perfil' });
  }
}

export async function updateProfile(req, res) {
  try {
    const profile = await updateUserProfile(req.auth.sub, req.params.id, req.body);
    res.json(profile);
  } catch (e) {
    res.status(404).json({ error: e.message || 'Error al actualizar perfil' });
  }
}

export async function deleteProfile(req, res) {
  try {
    await deleteUserProfile(req.auth.sub, req.params.id);
    res.json({ ok: true });
  } catch (e) {
    res.status(404).json({ error: e.message || 'Error al eliminar perfil' });
  }
}