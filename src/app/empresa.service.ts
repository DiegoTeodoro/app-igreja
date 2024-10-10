import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmpresaService {
  private apiUrl = 'http://localhost:3000/empresas';  // URL base da API para empresas

  constructor(private http: HttpClient) {}

  // Método para cadastrar nova empresa
  cadastrarEmpresa(empresa: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, empresa);
  }

  // Método para pesquisar empresas
  pesquisarEmpresas(filtros: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/pesquisar`, filtros);
  }

  // Método para listar todas as empresas
  listarEmpresas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Método para obter uma empresa por ID
  obterEmpresaPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Método para atualizar uma empresa
  atualizarEmpresa(id: number, empresa: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, empresa);
  }

  // Método para deletar uma empresa
  deletarEmpresa(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
