import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inventario } from './models/inventario';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private apiUrl = 'http://localhost:3000/inventarios';

  constructor(private http: HttpClient) {}

  getProdutos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/produtos`);
  }

  saveInventario(inventarioData: Inventario[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/lote`, inventarioData);
  }
}
