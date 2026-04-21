const BASE = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  const url = `${BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const err = new Error(body.message || res.statusText);
    err.status = res.status;
    err.body = body;
    throw err;
  }
  const contentType = res.headers.get('content-type');
  if (res.status === 204 || res.headers.get('content-length') === '0') return null;
  if (!contentType || !contentType.includes('application/json')) return null;
  const text = await res.text();
  if (!text || text.trim() === '') return null;
  return JSON.parse(text);
}

// Auth
export async function getMe() {
  return request('/api/utilisateur/me');
}

export async function login(courriel, password) {
  return request('/api/utilisateur/login', {
    method: 'POST',
    body: JSON.stringify({ courriel, password }),
  });
}

export async function logout() {
  return request('/api/utilisateur/logout', { method: 'POST' });
}

export async function register(body, options = {}) {
  const { autoLogin = false } = options;
  const url = autoLogin ? '/api/utilisateur/inscription?login=1' : '/api/utilisateur/inscription';
  return request(url, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

// Users
export async function getUser(id) {
  return request(`/api/utilisateur/${id}`);
}

export async function updateUser(id, data) {
  return request('/api/utilisateur', {
    method: 'PATCH',
    body: JSON.stringify({ id, ...data }),
  });
}

export async function setModeConducteur() {
  return request('/api/utilisateur/mode-conducteur', { method: 'PATCH' });
}

export async function setModePassager() {
  return request('/api/utilisateur/mode-passager', { method: 'PATCH' });
}

// Trips
export async function getTrajets(params = {}) {
  const sp = new URLSearchParams();
  if (params.pointDeDepart) sp.set('pointDeDepart', params.pointDeDepart);
  if (params.pointDarrivee) sp.set('pointDarrivee', params.pointDarrivee);
  if (params.date) sp.set('date', params.date);
  const q = sp.toString();
  return request(`/api/trajet${q ? `?${q}` : ''}`);
}

export async function getTrajet(id) {
  return request(`/api/trajet/${id}`);
}

export async function getTrajetReservations(trajetId) {
  return request(`/api/trajet/${trajetId}/reservations`);
}

export async function getMesTrajets() {
  return request('/api/mes-trajets');
}

export async function createTrajet(body) {
  return request('/api/trajet', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function updateTrajet(id, body) {
  return request('/api/trajet', {
    method: 'PATCH',
    body: JSON.stringify({ id, ...body }),
  });
}

export async function cancelTrajet(id) {
  return request(`/api/trajet/${id}/annuler`, { method: 'PATCH' });
}

export async function terminerTrajet(id) {
  return request(`/api/trajet/${id}/terminer`, { method: 'PATCH' });
}

export async function deleteTrajet(id) {
  return request('/api/trajet', {
    method: 'DELETE',
    body: JSON.stringify({ id }),
  });
}

// Reservations
export async function getMesReservations() {
  return request('/api/mes-reservations');
}

export async function getReservation(id) {
  return request(`/api/reservation/${id}`);
}

export async function createReservation(trajet_id) {
  return request('/api/reservation', {
    method: 'POST',
    body: JSON.stringify({ trajet_id }),
  });
}

export async function cancelReservation(id) {
  return request(`/api/reservation/${id}`, { method: 'DELETE' });
}

export async function acceptReservation(id) {
  return request(`/api/reservation/${id}/accepter`, { method: 'PATCH' });
}

export async function refuseReservation(id) {
  return request(`/api/reservation/${id}/refuser`, { method: 'PATCH' });
}

// Admin
export async function getAdminStats() {
  return request('/api/admin/stats');
}

export async function getUtilisateurs() {
  return request('/api/utilisateur');
}

export async function getPieceIdentiteByUser(utilisateurId) {
  return request(`/api/utilisateur/${utilisateurId}/piece-identite`);
}

export async function getReservations() {
  return request('/api/reservation');
}

export async function validateUser(id) {
  return request(`/api/utilisateur/${id}/valider`, { method: 'PATCH' });
}

export async function desactiverUser(id) {
  return request(`/api/utilisateur/${id}/desactiver`, { method: 'PATCH' });
}

export async function reactiverUser(id) {
  return request(`/api/utilisateur/${id}/reactiver`, { method: 'PATCH' });
}

export async function noteUser(id, note) {
  return request(`/api/utilisateur/${id}/noter`, {
    method: 'POST',
    body: JSON.stringify({ note }),
  });
}

export async function submitPieceIdentite(imageBase64) {
  return request('/api/piece-identite', {
    method: 'POST',
    body: JSON.stringify(imageBase64 ? { image: imageBase64 } : {}),
  });
}

export async function getMesPiecesIdentite() {
  return request('/api/piece-identite/mes');
}
