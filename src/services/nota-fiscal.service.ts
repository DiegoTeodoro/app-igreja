import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotaFiscal } from '../app/models/nota-fiscal';
import { Fornecedor } from '../app/models/fornecedores';
import { Produto } from '../app/models/produto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotaFiscalService {
  private notasFiscaisUrl: string;
  private igrejasUrl: string;
  private fornecedoresUrl: string;
  private produtosUrl: string;
  private itensNotaFiscalUrl: string;

  constructor(private http: HttpClient) {
    const apiUrl = environment.apiUrl;
    this.notasFiscaisUrl = `${apiUrl}/notas-fiscais`;
    this.igrejasUrl = `${apiUrl}/igrejas`;
    this.fornecedoresUrl = `${apiUrl}/fornecedores`;
    this.produtosUrl = `${apiUrl}/produtos`;
    this.itensNotaFiscalUrl = `${apiUrl}/itens-nota-fiscal`;
  }

  getIgrejas(): Observable<any[]> {
    return this.http.get<any[]>(this.igrejasUrl);
  }

  salvarNotaFiscal(notaFiscal: any): Observable<any> {
    return this.http.post(this.notasFiscaisUrl, notaFiscal, { responseType: 'json' });
  }

  atualizarNotaFiscal(id: number, notaFiscal: NotaFiscal): Observable<any> {
    return this.http.put(`${this.notasFiscaisUrl}/${id}`, notaFiscal);
  }

  getNotasFiscais(): Observable<any[]> {
    return this.http.get<any[]>(this.notasFiscaisUrl);
  }

  searchNotaFiscal(numeroNota: string): Observable<NotaFiscal[]> {
    return this.http.get<NotaFiscal[]>(`${this.notasFiscaisUrl}?numero_nota=${numeroNota}`);
  }

  deleteNotaFiscal(id: number): Observable<void> {
    return this.http.delete<void>(`${this.notasFiscaisUrl}/${id}`);
  }

  getFornecedores(): Observable<Fornecedor[]> {
    return this.http.get<Fornecedor[]>(this.fornecedoresUrl);
  }

  getProdutos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.produtosUrl);
  }

  consultarNotasFiscais(filtro: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.notasFiscaisUrl}/consultar`, filtro);
  }

  getNotaFiscalByNumero(numeroNota: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.notasFiscaisUrl}/numero/${numeroNota}`);
  }

  getItensNotaFiscal(notaId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.itensNotaFiscalUrl}/${notaId}`);
  }
}