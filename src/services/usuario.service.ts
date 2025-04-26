import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private usuariosUrl : string; // Ajuste a URL conforme necessário

  constructor(private http: HttpClient) {
    this.usuariosUrl = `${environment.apiUrl}/usuarios`
  }

  createUsuario(usuario: any): Observable<any> {
    return this.http.post<any>(`${this.usuariosUrl}`, usuario);
  }

  updateUsuario(usuario: any): Observable<any> {
    return this.http.put<any>(`${this.usuariosUrl}/${usuario.id}`, usuario);
  }
  
  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.usuariosUrl}`);
  }


  login(credentials: { login: string; senha: string }): Observable<any> {
    return this.http.post<any>(`${this.usuariosUrl}/login`, credentials); // Certifique-se de que a rota está correta
  }
  
}
