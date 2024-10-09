import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CidadeService {
  private apiUrl = 'http://localhost:3000/cidades';

  constructor(private http: HttpClient) {}

  getCidades(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  createCidade(cidade: any): Observable<any> {
    return this.http.post(this.apiUrl, cidade);
  }

  updateCidade(id: number, cidade: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, cidade);
  }

  deleteCidade(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  getCidadesByEstado(estadoId: number): Observable<any> {
    return this.http.get(`/api/cidades?estado_id=${estadoId}`);
  }
}