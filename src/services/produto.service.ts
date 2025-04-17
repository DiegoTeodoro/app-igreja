import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produto } from '../app/models/produto';
import { Categoria } from '../app/models/categoria';
import { Fornecedor } from '../app/models/fornecedores';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private produtosUrl: string;
  private categoriasUrl: string;
  private fornecedoresUrl: string;

  constructor(private http: HttpClient) {
    const apiUrl = environment.apiUrl;
    this.produtosUrl = `${apiUrl}/api/produtos`;
    this.categoriasUrl = `${apiUrl}/api/categorias`;
    this.fornecedoresUrl = `${apiUrl}/api/fornecedores`;
  }

  getProdutosByNome(nome: string): Observable<{ id: number; nome: string }[]> {
    return this.http.get<{ id: number; nome: string }[]>(`${this.produtosUrl}?nome=${nome}`);
  }

  getProdutosSaldoEstoque() {
    throw new Error('Method not implemented.');
  }

  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.categoriasUrl);
  }

  getFornecedores(): Observable<Fornecedor[]> {
    return this.http.get<Fornecedor[]>(this.fornecedoresUrl);
  }

  getProdutos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.produtosUrl);
  }

  getProdutoById(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.produtosUrl}/${id}`);
  }

  createProduto(produto: Produto): Observable<any> {
    return this.http.post(this.produtosUrl, produto, { responseType: 'text' });
  }

  updateProduto(id: number, produto: Produto): Observable<any> {
    return this.http.put(`${this.produtosUrl}/${id}`, produto, { responseType: 'text' });
  }

  deleteProduto(id: number): Observable<any> {
    return this.http.delete(`${this.produtosUrl}/${id}`, { responseType: 'text' });
  }
}
