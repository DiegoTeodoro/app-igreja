import { Component, OnInit } from '@angular/core';
import { CategoriaService } from '../../services/categoria.service';
import { Categoria } from '../models/categoria';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../cadastro-categoria/delete-dialog.component';


@Component({
  selector: 'app-cadastro-categoria',
  templateUrl: './cadastro-categoria.component.html',
  styleUrls: ['./cadastro-categoria.component.css']
})
export class CadastroCategoriaComponent  implements OnInit {
  categoria: Categoria = { id: 0, nome: '' };
  categorias: Categoria[] = [];
  displayedColumns: string[] = ['id', 'nome', 'actions'];

  constructor(private categoriaService: CategoriaService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadCategorias();
  }

  onSubmit() {
    if (this.categoria.id === 0) {
      // Create new category
      this.categoriaService.createCategoria(this.categoria).subscribe(response => {
        console.log('Categoria criada com sucesso!', response);
        this.loadCategorias();
        this.categoria = { id: 0, nome: '' };
      });
    } else {
      // Update existing category
      this.categoriaService.updateCategoria(this.categoria).subscribe(response => {
        console.log('Categoria atualizada com sucesso!', response);
        this.loadCategorias();
        this.categoria = { id: 0, nome: '' };
      });
    }
  }

  onEdit(categoria: Categoria) {
    this.categoria = { ...categoria };
  }

  onDelete(categoria: Categoria) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '250px',
      data: categoria
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categoriaService.deleteCategoria(categoria.id).subscribe(response => {
          console.log('Categoria deletada com sucesso!', response);
          this.loadCategorias();
        });
      }
    });
  }

  loadCategorias() {
    this.categoriaService.getCategorias().subscribe((data: Categoria[]) => {
      this.categorias = data;
    });
  }
}
