import Profile from '../models/Profile.mjs';

export function listUserProfiles(userId) {
  return Profile.find({ userId }).sort({ createdAt: 1 });
}

export function createUserProfile(userId, { name, type = 'adult', avatar = '' }) {
  if (!name?.trim()) throw new Error('El nombre es obligatorio');
  return Profile.create({ userId, name: name.trim(), type, avatar });
}

export async function updateUserProfile(userId, profileId, data) {
  const updated = await Profile.findOneAndUpdate(
    { _id: profileId, userId },
    data,
    { new: true }
  );
  if (!updated) throw new Error('Perfil no encontrado');
  return updated;
}

export async function deleteUserProfile(userId, profileId) {
  const deleted = await Profile.findOneAndDelete({ _id: profileId, userId });
  if (!deleted) throw new Error('Perfil no encontrado');
  return true;
}