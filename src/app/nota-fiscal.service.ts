import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotaFiscal } from '../app/models/nota-fiscal';

@Injectable({
  providedIn: 'root'
})
export class NotaFiscalService {
  private apiUrl = 'http://localhost:3000/notas-fiscais'; // Certifique-se de que a URL está correta

  constructor(private http: HttpClient) {}

  salvarNotaFiscal(notaFiscal: NotaFiscal): Observable<any> {
    return this.http.post(this.apiUrl, notaFiscal); // Verifique o endpoint aqui
  }
}
