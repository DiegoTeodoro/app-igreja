import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PedidoCompra } from '../app/models/pedido-compra';

@Injectable({
  providedIn: 'root'
})
export class PedidoCompraService {
  private apiUrl = 'http://localhost:3000/pedido-compra';

  constructor(private http: HttpClient) {}

  createPedido(pedido: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, pedido); // Remova '/pedido-compra'
}

salvarPedido(pedido: any): Observable<any> {
  return this.http.post<any>(this.apiUrl, pedido);
}

  getPedidos(): Observable<PedidoCompra[]> {
    return this.http.get<PedidoCompra[]>(this.apiUrl);
  }

  getPedidoById(id: number): Observable<PedidoCompra> {
    return this.http.get<PedidoCompra>(`${this.apiUrl}/${id}`);
  }

  updatePedido(id: number, pedido: PedidoCompra): Observable<PedidoCompra> {
    return this.http.put<PedidoCompra>(`${this.apiUrl}/${id}`, pedido);
  }

  deletePedido(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getProdutoByName(nome: string): Observable<any> {
    const url = `http://localhost:3000/produtos/nome/${nome}`;
    return this.http.get<any>(url);
  }
  
  
}
