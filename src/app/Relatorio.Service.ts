import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RelatorioService {
  getIgrejas() {
    throw new Error('Method not implemented.');
  }
  private apiUrl = 'http://localhost:3000/relatorio-pedido'; // URL do backend

  constructor(private http: HttpClient) {}

  gerarRelatorio(params: any): Observable<Blob> {
    return this.http.post(this.apiUrl, params, { responseType: 'blob' });
  }
}
