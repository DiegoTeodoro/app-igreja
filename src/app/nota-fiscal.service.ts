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
  private apiUrl = 'http://localhost:3000/notas-fiscais'; // Certifique-se de que a URL está correta

  constructor(private http: HttpClient) {}

  salvarNotaFiscal(notaFiscal: NotaFiscal): Observable<any> {
    return this.http.post(this.apiUrl, notaFiscal); // Verifique o endpoint aqui
  }

 // Método para atualizar uma nota fiscal existente
  atualizarNotaFiscal(id: number, notaFiscal: NotaFiscal): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, notaFiscal);
  }

  // Método para obter todas as notas fiscais
  getNotasFiscais(): Observable<NotaFiscal[]> {
    return this.http.get<NotaFiscal[]>(this.apiUrl);
  }

  // Método para pesquisar uma nota fiscal pelo número
  searchNotaFiscal(numeroNota: string): Observable<NotaFiscal[]> {
    return this.http.get<NotaFiscal[]>(`${this.apiUrl}?numero_nota=${numeroNota}`);
  }

  // Método para excluir uma nota fiscal pelo ID
  deleteNotaFiscal(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getFornecedores() {
    return this.http.get<Fornecedor[]>('http://localhost:3000/fornecedores');
  }
  
  getProdutos() {
    return this.http.get<Produto[]>('http://localhost:3000/produtos');
  }
  
}