import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CidadeService {
  private cidadesUrl: string;

  constructor(private http: HttpClient) {
    // ✅ Correto: já inclui o /api vindo do environment
    this.cidadesUrl = `${environment.apiUrl}/cidades`;
  }

  getCidades(): Observable<any> {
    return this.http.get(this.cidadesUrl);
  }

  getCidadesByEstado(estadoId: number): Observable<any> {
    return this.http.get(`${this.cidadesUrl}?estado_id=${estadoId}`);
  }

  createCidade(cidade: any): Observable<any> {
    return this.http.post(this.cidadesUrl, cidade);
  }

  updateCidade(id: number, cidade: any): Observable<any> {
    return this.http.put(`${this.cidadesUrl}/${id}`, cidade);
  }

  deleteCidade(id: number): Observable<any> {
    return this.http.delete(`${this.cidadesUrl}/${id}`);
  }
}
