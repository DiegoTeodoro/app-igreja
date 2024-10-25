import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Empresa } from './models/empresa';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
 
  private apiUrlIgrejas = 'http://localhost:3000/igrejas';  // URL da API de igrejas
  private apiUrlProdutos = 'http://localhost:3000/produtos';  // URL da API de produtos
  
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
  
  

  
}
