import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Igreja, IgrejaDetalhes } from '../app/models/igreja';

@Injectable({
  providedIn: 'root'
})

@Injectable({
  providedIn: 'root'
})
export class IgrejaService {

  private baseUrl = 'http://localhost:3000/igrejas';

  constructor(private http: HttpClient) {}

  getIgrejas(): Observable<Igreja[]> {
    return this.http.get<Igreja[]>(this.baseUrl);
  }

  addIgreja(igreja: Igreja): Observable<any> {
    return this.http.post(this.baseUrl, igreja);
  }

  updateIgreja(id: number, igreja: Igreja): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, igreja);
  }

  deleteIgreja(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}