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
    this.inventarioUrl = `${apiUrl}/api/inventarios`;
    this.produtosUrl = `${apiUrl}/api/produtos`;
    this.usuariosUrl = `${apiUrl}/api/usuarios`;
    this.relatorioInventarioUrl = `${apiUrl}/api/relatorio-inventario`;
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
