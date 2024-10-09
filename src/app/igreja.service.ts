import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Igreja, IgrejaDetalhes } from './models/igreja';

@Injectable({
  providedIn: 'root'
})
export class IgrejaService {
  private apiUrl = 'http://localhost:3000/igrejas';

  constructor(private http: HttpClient) {}

  getIgrejas(): Observable<Igreja[]> {
    return this.http.get<Igreja[]>(this.apiUrl);
  }

  getIgrejaById(id: number): Observable<IgrejaDetalhes> {
    return this.http.get<IgrejaDetalhes>(`${this.apiUrl}/${id}`);
  }

  createIgreja(igreja: Igreja): Observable<any> {
    return this.http.post(this.apiUrl, igreja, { responseType: 'text' });
  }

  updateIgreja(id: number, igreja: Igreja): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, igreja, { responseType: 'text' });
  }

  deleteIgreja(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }
}