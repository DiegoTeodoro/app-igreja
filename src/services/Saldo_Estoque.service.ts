// Saldo_Estoque.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SaldoEstoque } from '../app/models/SaldoEstoque';

@Injectable({
  providedIn: 'root'
})
export class SaldoEstoqueService {
  private apiUrl = 'http://localhost:3000/saldo-estoque';

  constructor(private http: HttpClient) {}

  getSaldoEstoque(): Observable<SaldoEstoque[]> {
    return this.http.get<SaldoEstoque[]>(this.apiUrl);
  }
  

  // Método para buscar o valor unitário com base no produto_id
  getPrecoUnitario(produtoId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/preco/${produtoId}`);
  }

 // Método para atualizar o saldo de estoque com base no produto_id e quantidade
 updateSaldoEstoque(produto_id: number, quantidade: number, valor_unitario: number): Observable<any> {
  const body = { quantidade, valor_unitario };  // Enviar tanto a quantidade quanto o valor unitário
  return this.http.put(`${this.apiUrl}/update/${produto_id}`, body);
}


}