import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'authToken';

  isTokenExpired(token: string): boolean {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp * 1000; // Converta para milissegundos
    return Date.now() > expiry;
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    if (!token) return false;
    return !this.isTokenExpired(token);
  }
  
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userProfile');
  }
}
