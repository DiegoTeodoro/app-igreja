import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {
  private apiUrl = 'http://localhost:3000/estados';

  constructor(private http: HttpClient) {}

  getEstados(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  createEstado(estado: any): Observable<any> {
    return this.http.post(this.apiUrl, estado);
  }

  updateEstado(id: number, estado: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, estado);
  }

  deleteEstado(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
