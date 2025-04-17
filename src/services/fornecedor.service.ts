import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FornecedorService {
  private fornecedoresUrl : string;

  constructor(private http: HttpClient) {
    this.fornecedoresUrl = `${environment.apiUrl}/api/fornecedores`
  }

  getFornecedores(): Observable<any> {
    return this.http.get(this.fornecedoresUrl);
  }

  createFornecedor(fornecedor: any): Observable<any> {
    return this.http.post(this.fornecedoresUrl, fornecedor);
  }

  updateFornecedor(id: number, fornecedor: any): Observable<any> {
    return this.http.put(`${this.fornecedoresUrl}/${id}`, fornecedor);
  }

  deleteFornecedor(id: number): Observable<any> {
    return this.http.delete(`${this.fornecedoresUrl}/${id}`);
  }
}
