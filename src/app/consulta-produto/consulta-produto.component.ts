import { Component, Inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ProdutoService } from '../produto.service';
import { Produto } from '../models/produto';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog'; // Certifique-se de importar o MatDialog aqui

@Component({
  selector: 'confirm-dialog',
  template: `
    <h1 mat-dialog-title>Confirmação</h1>
    <div mat-dialog-content>
      <p>{{data.message}}</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onNoClick()">Não</button>
      <button mat-button [mat-dialog-close]="true">Sim</button>
    </div>
  `,
})
export class ConfirmDialog {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-consulta-produto',
  templateUrl: './consulta-produto.component.html',
  styleUrls: ['./consulta-produto.component.css']
})
export class ConsultaProdutoComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nome', 'volume', 'codigo_barras', 'categoria_id', 'marca', 'fornecedor_id'];
  dataSource = new MatTableDataSource<Produto>();

  // Corrigido: Importação de MatDialog no construtor
  constructor(private produtoService: ProdutoService, private router: Router, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.produtoService.getProdutos().subscribe(data => {
      this.dataSource.data = data;
    });
    this.dataSource.filterPredicate = (data: Produto, filter: string) => {
      const dataStr = Object.keys(data).reduce((currentTerm: string, key: string) => {
        return currentTerm + (data as { [key: string]: any })[key] + ' ';
      }, '').toLowerCase();
      return dataStr.indexOf(filter) != -1;
    };
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editarProduto(produto: Produto): void {
    this.router.navigate(['/cadastro-produto', produto.id]);
  }
  
  deletarProduto(produto: Produto): void {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '250px',
      data: { message: `Tem certeza que deseja excluir o produto ${produto.nome}?` }
    });
  
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.produtoService.deleteProduto(produto.id!).subscribe({
          next: (response) => {
            alert(response); // Aqui o 'response' será "Produto deletado com sucesso"
            this.router.navigate(['/consulta-produto']).then(() => {
              window.location.reload();
            });
          },
          error: (error) => {
            console.error('Erro ao deletar o produto:', error);
            alert('Ocorreu um erro ao deletar o produto.');
          }
        });
      }
    });
  }

  voltarParaCadastro(): void {
    this.router.navigate(['/produto']);
  }
}
