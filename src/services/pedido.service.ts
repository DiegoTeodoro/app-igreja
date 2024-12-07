import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private apiUrlIgrejas = 'http://localhost:3000/igrejas';  // URL da API de igrejas
  private apiUrlProdutos = 'http://localhost:3000/produtos';  // URL da API de produtos
  private apiUrlPedidos = 'http://localhost:3000/pedidos';  // URL da API de pedidos

  constructor(private http: HttpClient) {}

  getIgrejas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrlIgrejas);
  }

  getProdutos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrlProdutos);
  }

  salvarPedido(pedido: any): Observable<any> {
    return this.http.post('http://localhost:3000/pedidos', pedido, { responseType: 'text' });
  }

  getPedidos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlPedidos}?_expand=igreja`);
  }

  getPedidoById(id: number): Observable<any> {
    console.log(`Buscando pedido com ID: ${id}`);
    return this.http.get<any>(`${this.apiUrlPedidos}/${id}`).pipe(
      catchError((error) => {
        console.error('Erro ao buscar pedido:', error);
        return throwError(() => new Error('Erro ao buscar pedido'));
      })
    );
  }
  getItensPedidoById(pedidoId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/pedido-itens/${pedidoId}`).pipe(
      catchError((error) => {
        console.error('Erro ao buscar itens do pedido:', error);
        return throwError(() => new Error('Erro ao buscar itens do pedido'));
      })
    );
  }
  
  getPedidosDetalhados(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/pedidos?_expand=igreja&_embed=itens');
  }
  
}
