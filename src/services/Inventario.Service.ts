import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InventarioService {
  private inventarioUrl: string;
  private produtosUrl: string;
  private usuariosUrl: string;
  private relatorioInventarioUrl: string;

  constructor(private http: HttpClient) {
    const apiUrl = environment.apiUrl;
    this.inventarioUrl = `${apiUrl}/inventarios`;
    this.produtosUrl = `${apiUrl}/produtos`;
    this.usuariosUrl = `${apiUrl}/usuarios`;
    this.relatorioInventarioUrl = `${apiUrl}/relatorio-inventario`;
  }

  getProdutos(): Observable<any[]> {
    return this.http.get<any[]>(this.produtosUrl);
  }

  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(this.usuariosUrl);
  }

  saveInventario(inventarioData: any[]): Observable<any> {
    return this.http.post(`${this.inventarioUrl}/lote`, inventarioData, { responseType: 'json' });
  }

  getRelatorioInventario(): Observable<any[]> {
    return this.http.get<any[]>(this.relatorioInventarioUrl);
  }
}
