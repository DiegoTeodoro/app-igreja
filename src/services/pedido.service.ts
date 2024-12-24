import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private igrejasUrl: string;
  private produtosUrl: string;
  private pedidosUrl: string;
  private consultaPedidosUrl: string;
  private itensPedidoUrl: string;

  constructor(private http: HttpClient) {
    const apiUrl = environment.apiUrl;
    this.igrejasUrl = `${apiUrl}/igrejas`;
    this.produtosUrl = `${apiUrl}/produtos`;
    this.pedidosUrl = `${apiUrl}/pedidos`;
    this.consultaPedidosUrl = `${apiUrl}/consulta-pedidos`;
    this.itensPedidoUrl = `${apiUrl}/pedido-itens`;
  }

  getIgrejas(): Observable<any[]> {
    return this.http.get<any[]>(this.igrejasUrl);
  }

  getProdutos(): Observable<any[]> {
    return this.http.get<any[]>(this.produtosUrl);
  }

  salvarPedido(pedido: any): Observable<any> {
    return this.http.post(this.pedidosUrl, pedido, { responseType: 'text' });
  }

  getPedidos(): Observable<any[]> {
    return this.http.get<any[]>(this.pedidosUrl).pipe(
      tap((data) => console.log('Dados da API de pedidos:', data)), // Log para debug
      catchError((error) => {
        console.error('Erro ao buscar pedidos:', error);
        return throwError(() => new Error('Erro ao buscar pedidos'));
      })
    );
  }

  getConsultaPedidos(): Observable<any[]> {
    return this.http.get<any[]>(this.consultaPedidosUrl);
  }

  getPedidoById(id: number): Observable<any> {
    const url = `${this.pedidosUrl}/${id}`;
    return this.http.get<any>(url).pipe(
      tap((pedido) => console.log('Pedido retornado pela API:', pedido)),
      catchError((error) => {
        console.error('Erro ao buscar pedido:', error);
        return throwError(() => new Error('Erro ao buscar pedido'));
      })
    );
  }

  getPedidosDetalhados(): Observable<any[]> {
    return this.http.get<any[]>(`${this.pedidosUrl}?_expand=igreja&_embed=itens`);
  }

  getItensPedidoById(pedidoId: number): Observable<any[]> {
    const url = `${this.itensPedidoUrl}/${pedidoId}`;
    return this.http.get<any[]>(url);
  }
}
