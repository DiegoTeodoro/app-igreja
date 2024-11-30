import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotaFiscal } from '../app/models/nota-fiscal';
import { Fornecedor } from './models/fornecedores';
import { Produto } from './models/produto';

@Injectable({
  providedIn: 'root'
})
export class NotaFiscalService {
  private apiUrl = 'http://localhost:3000/notas-fiscais';

  constructor(private http: HttpClient) {}

  // Método corrigido para buscar igrejas
  getIgrejas(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/igrejas');
  }

  salvarNotaFiscal(notaFiscal: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, notaFiscal, { responseType: 'json' });
  }

  atualizarNotaFiscal(id: number, notaFiscal: NotaFiscal): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, notaFiscal);
  }

  getNotasFiscais(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  searchNotaFiscal(numeroNota: string): Observable<NotaFiscal[]> {
    return this.http.get<NotaFiscal[]>(`${this.apiUrl}?numero_nota=${numeroNota}`);
  }

  deleteNotaFiscal(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getFornecedores(): Observable<Fornecedor[]> {
    return this.http.get<Fornecedor[]>('http://localhost:3000/fornecedores');
  }

  getProdutos(): Observable<Produto[]> {
    return this.http.get<Produto[]>('http://localhost:3000/produtos');
  }

  consultarNotasFiscais(filtro: any): Observable<any[]> {
    return this.http.post<any[]>('http://localhost:3000/notas-fiscais/consultar', filtro);
  }

  getNotaFiscalByNumero(numeroNota: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/numero/${numeroNota}`);
  }

  getItensNotaFiscal(notaId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/itens-nota-fiscal/${notaId}`);
  }

  
}
