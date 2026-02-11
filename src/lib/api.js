const API_BASE = import.meta.env.VITE_API_URL || '/api';

function authHeaders(token) {
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchProfile(token) {
    const res = await fetch(`${API_BASE}/me`, {
        headers: authHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
}

export async function fetchLogs(token, page = 1, limit = 20) {
    const res = await fetch(`${API_BASE}/logs?page=${page}&limit=${limit}`, {
        headers: authHeaders(token),
    });
    if (!res.ok) throw new Error('Failed to fetch logs');
    return res.json();
}
