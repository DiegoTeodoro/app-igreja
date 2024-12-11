import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InventarioService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getProdutos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/produtos`);
  }
  
  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuarios`);
  }

  saveInventario(inventarioData: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/inventarios/lote`, inventarioData, { responseType: 'json' });
  } 
  
  getRelatorioInventario(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/relatorio-inventario`);
  }
  
}
