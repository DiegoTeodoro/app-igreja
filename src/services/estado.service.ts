import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {
  private estadosUrl :string;

  constructor(private http: HttpClient) {
    this.estadosUrl = `${environment.apiUrl}/estados`
  }

  getEstados(): Observable<any> {
    return this.http.get(this.estadosUrl);
  }

  createEstado(estado: any): Observable<any> {
    return this.http.post(this.estadosUrl, estado);
  }

  updateEstado(id: number, estado: any): Observable<any> {
    return this.http.put(`${this.estadosUrl}/${id}`, estado);
  }

  deleteEstado(id: number): Observable<any> {
    return this.http.delete(`${this.estadosUrl}/${id}`);
  }
}
