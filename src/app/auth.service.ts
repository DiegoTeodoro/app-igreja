import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000'; // URL do backend

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: any) {
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }

  register(user: any) {
    return this.http.post(`${this.baseUrl}/register`, user);
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  get isLoggedIn() {
    return !!localStorage.getItem('token');
  }
}
