const API_URL = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

const headers = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

// AUTH
export const register = (data) =>
  fetch(`${API_URL}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json());

export const login = (data) =>
  fetch(`${API_URL}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json());

// TRAJETS
export const getTrajets = () =>
  fetch(`${API_URL}/trajets`).then(r => r.json());

export const getTrajet = (id) =>
  fetch(`${API_URL}/trajets/${id}`).then(r => r.json());

export const createTrajet = (data) =>
  fetch(`${API_URL}/trajets`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(r => r.json());

export const searchTrajets = (params) =>
  fetch(`${API_URL}/trajets/recherche?${new URLSearchParams(params)}`).then(r => r.json());

// RESERVATIONS
export const getMesReservations = () =>
  fetch(`${API_URL}/reservations/mes-reservations`, { headers: headers() }).then(r => r.json());

export const createReservation = (trajet_id) =>
  fetch(`${API_URL}/reservations`, { method: 'POST', headers: headers(), body: JSON.stringify({ trajet_id }) }).then(r => r.json());

export const annulerReservation = (id) =>
  fetch(`${API_URL}/reservations/${id}`, { method: 'DELETE', headers: headers() }).then(r => r.json());

// PROFIL
export const getProfil = () =>
  fetch(`${API_URL}/profil`, { headers: headers() }).then(r => r.json());

export const updateProfil = (data) =>
  fetch(`${API_URL}/profil`, { method: 'PUT', headers: headers(), body: JSON.stringify(data) }).then(r => r.json());

// ADMIN
export const getUsers = () =>
  fetch(`${API_URL}/admin/users`, { headers: headers() }).then(r => r.json());

export const validerUser = (id) =>
  fetch(`${API_URL}/admin/users/${id}/valider`, { method: 'PUT', headers: headers() }).then(r => r.json());

export const rejeterUser = (id) =>
  fetch(`${API_URL}/admin/users/${id}/rejeter`, { method: 'PUT', headers: headers() }).then(r => r.json());

export const getStats = () =>
  fetch(`${API_URL}/admin/stats`, { headers: headers() }).then(r => r.json());
