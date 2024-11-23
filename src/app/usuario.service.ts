import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private baseUrl = 'http://localhost:3000/usuarios'; // Ajuste a URL conforme necessário

  constructor(private http: HttpClient) {}

  createUsuario(usuario: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, usuario);
  }

  updateUsuario(usuario: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${usuario.id}`, usuario);
  }
  
  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`);
  }


  login(credentials: { login: string; senha: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, credentials); // Certifique-se de que a rota está correta
  }
  
}
