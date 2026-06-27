export function setToken(token: string) {
  localStorage.setItem('token', token);
  document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
  window.dispatchEvent(new Event('auth-change'));
}

export function removeToken() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  document.cookie = 'token=; path=/; max-age=0';
  window.dispatchEvent(new Event('auth-change'));
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export function setUser(user: object) {
  localStorage.setItem('user', JSON.stringify(user));
  window.dispatchEvent(new Event('auth-change'));
}

export function getUser() {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem('user');
  return data ? JSON.parse(data) : null;
}
