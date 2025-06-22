export function isAuthenticated(): boolean {
  // This will be handled by the useAuth hook
  return false;
}

export function getStoredAuthToken(): string | null {
  return localStorage.getItem('authToken');
}

export function setStoredAuthToken(token: string): void {
  localStorage.setItem('authToken', token);
}

export function removeStoredAuthToken(): void {
  localStorage.removeItem('authToken');
}

export function redirectToLogin(): void {
  window.location.href = '/';
}
