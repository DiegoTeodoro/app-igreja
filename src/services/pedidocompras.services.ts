import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PedidoCompra } from '../app/models/pedido-compra';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PedidoCompraService {
  private pedidoCompraUrl: string;
  private produtosUrl: string;

  constructor(private http: HttpClient) {
    const apiUrl = environment.apiUrl;
    this.pedidoCompraUrl = `${apiUrl}/pedido-compra`;
    this.produtosUrl = `${apiUrl}/produtos`;
  }

  createPedido(pedido: any): Observable<any> {
    return this.http.post<any>(this.pedidoCompraUrl, pedido);
  }

  salvarPedido(pedido: any): Observable<any> {
    return this.http.post<any>(this.pedidoCompraUrl, pedido);
  }

  getPedidos(): Observable<PedidoCompra[]> {
    return this.http.get<PedidoCompra[]>(this.pedidoCompraUrl);
  }

  getPedidoById(id: number): Observable<PedidoCompra> {
    return this.http.get<PedidoCompra>(`${this.pedidoCompraUrl}/${id}`);
  }

  updatePedido(id: number, pedido: PedidoCompra): Observable<PedidoCompra> {
    return this.http.put<PedidoCompra>(`${this.pedidoCompraUrl}/${id}`, pedido);
  }

  deletePedido(id: number): Observable<void> {
    return this.http.delete<void>(`${this.pedidoCompraUrl}/${id}`);
  }

  getProdutoByName(nome: string): Observable<any> {
    return this.http.get<any>(`${this.produtosUrl}/nome/${nome}`);
  }

  getRelatorioPedidos(dataInicio: Date, dataFim: Date): Observable<any[]> {
    const params = {
      dataInicio: dataInicio.toISOString().split('T')[0],
      dataFim: dataFim.toISOString().split('T')[0],
    };
    return this.http.get<any[]>(`${this.pedidoCompraUrl}/relatorio`, { params });
  }
}
