import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap, throwError } from 'rxjs';


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
    return this.http.get<any[]>('http://localhost:3000/pedidos').pipe(
      tap((data) => console.log('Dados da API de pedidos:', data)), // Adicione um log aqui
      catchError((error) => {
        console.error('Erro ao buscar pedidos:', error);
        return throwError(() => new Error('Erro ao buscar pedidos'));
      })
    );
  }
  
  getConsultaPedidos(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/consulta-pedidos');
  }
  
  getPedidoById(id: number): Observable<any> {
    const url = `${this.apiUrlPedidos}/${id}`; // URL para buscar o pedido pelo ID
    return this.http.get<any>(url).pipe(
      tap((pedido) => console.log('Pedido retornado pela API:', pedido)),
      catchError((error) => {
        console.error('Erro ao buscar pedido:', error);
        return throwError(() => new Error('Erro ao buscar pedido'));
      })
    );
  }
  
  
  getPedidosDetalhados(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/pedidos?_expand=igreja&_embed=itens');
  }

  getItensPedidoById(pedidoId: number): Observable<any[]> {
    const url = `http://localhost:3000/pedido-itens/${pedidoId}`; // Altere a URL conforme necessário
    return this.http.get<any[]>(url);
  }
  
  
}
