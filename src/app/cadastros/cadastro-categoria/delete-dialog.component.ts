import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Categoria } from '../../models/categoria';

@Component({
  selector: 'app-delete-dialog',
  template: `
    <h1 mat-dialog-title>Deletar Categoria</h1>
    <div mat-dialog-content>
      <p>Tem certeza que deseja excluir a categoria "{{data.nome}}"?</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onNoClick()">Cancelar</button>
      <button mat-button color="warn" [mat-dialog-close]="true">Deletar</button>
    </div>
  `,
})
export class DeleteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Categoria
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
