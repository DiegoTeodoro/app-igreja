import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SetorService {
  private apiUrl = 'http://localhost:3000/setores';

  constructor(private http: HttpClient) {}

  // Obter todos os setores
  getSetores(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Criar um novo setor
  createSetor(setor: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, setor);
  }

  // Atualizar um setor
  updateSetor(id: number, setor: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, setor);
  }

  // Deletar um setor
  deleteSetor(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
