import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../app/models/categoria';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private categoriasUrl : string;

  constructor(private http: HttpClient) {
    this.categoriasUrl = `${environment.apiUrl}/categorias`;
  }

  createCategoria(categoria: Categoria): Observable<Categoria> {
    return this.http.post<Categoria>(this.categoriasUrl, categoria);
  }

  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.categoriasUrl);
  }

  updateCategoria(categoria: Categoria): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.categoriasUrl}/${categoria.id}`, categoria);
  }

  deleteCategoria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.categoriasUrl}/${id}`);
  }
}
