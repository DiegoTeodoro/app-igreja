import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SetorService {
  private setoresUrl = 'http://localhost:3000/setores';

  constructor(private http: HttpClient) {
    this.setoresUrl = `${environment.apiUrl}/setores`

  }

  // Obter todos os setores
  getSetores(): Observable<any> {
    return this.http.get<any>(this.setoresUrl);
  }

  // Criar um novo setor
  createSetor(setor: any): Observable<any> {
    return this.http.post<any>(this.setoresUrl, setor);
  }

  // Atualizar um setor
  updateSetor(id: number, setor: any): Observable<any> {
    return this.http.put<any>(`${this.setoresUrl}/${id}`, setor);
  }

  // Deletar um setor
  deleteSetor(id: number): Observable<any> {
    return this.http.delete<any>(`${this.setoresUrl}/${id}`);
  }
}
