import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FornecedorService {
  private apiUrl = 'http://localhost:3000/fornecedores';

  constructor(private http: HttpClient) {}

  getFornecedores(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  createFornecedor(fornecedor: any): Observable<any> {
    return this.http.post(this.apiUrl, fornecedor);
  }

  updateFornecedor(id: number, fornecedor: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, fornecedor);
  }

  deleteFornecedor(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
