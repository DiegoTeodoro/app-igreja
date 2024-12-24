import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmpresaService {
  private empresasUrl :string;  // URL base da API para empresas

  constructor(private http: HttpClient) {
    this.empresasUrl = `${environment.apiUrl}/empresas`;
  }

  // Método para cadastrar nova empresa
  cadastrarEmpresa(empresa: any): Observable<any> {
    return this.http.post<any>(this.empresasUrl, empresa);
  }

  // Método para pesquisar empresas
  pesquisarEmpresas(filtros: any): Observable<any> {
    return this.http.post<any>(`${this.empresasUrl}/pesquisar`, filtros);
  }

  // Método para listar todas as empresas
  listarEmpresas(): Observable<any[]> {
    return this.http.get<any[]>(this.empresasUrl);
  }

  // Método para obter uma empresa por ID
  obterEmpresaPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.empresasUrl}/${id}`);
  }

  // Método para atualizar uma empresa
  atualizarEmpresa(id: number, empresa: any): Observable<any> {
    return this.http.put<any>(`${this.empresasUrl}/${id}`, empresa);
  }

  // Método para deletar uma empresa
  deletarEmpresa(id: number): Observable<any> {
    return this.http.delete<any>(`${this.empresasUrl}/${id}`);
  }
}
