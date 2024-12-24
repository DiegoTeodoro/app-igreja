import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Igreja, IgrejaDetalhes } from '../app/models/igreja';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})


export class IgrejaService {

  private igrejasUrl :string;

  constructor(private http: HttpClient) {
    this.igrejasUrl = `${environment.apiUrl}/igrejas`
  }

  getIgrejas(): Observable<Igreja[]> {
    return this.http.get<Igreja[]>(this.igrejasUrl);
  }

  addIgreja(igreja: Igreja): Observable<any> {
    return this.http.post(this.igrejasUrl, igreja);
  }

  updateIgreja(id: number, igreja: Igreja): Observable<any> {
    return this.http.put(`${this.igrejasUrl}/${id}`, igreja);
  }

  deleteIgreja(id: number): Observable<any> {
    return this.http.delete(`${this.igrejasUrl}/${id}`);
  }
}