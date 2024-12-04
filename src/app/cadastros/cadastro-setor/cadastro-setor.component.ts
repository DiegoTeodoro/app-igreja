import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SetorService } from '../../../services/setor.service'; // Importe o serviço Setor

@Component({
  selector: 'app-cadastro-setor',
  templateUrl: './cadastro-setor.component.html',
  styleUrls: ['./cadastro-setor.component.css']
})
export class CadastroSetorComponent implements OnInit {
  setorForm: FormGroup;
  setores: any[] = [];
  displayedColumns: string[] = ['nome', 'acoes'];
  setorEditId: number | null = null; // Para controle de edição

  constructor(private fb: FormBuilder, private setorService: SetorService) {
    this.setorForm = this.fb.group({
      nome: ['']
    });
  }

  ngOnInit(): void {
    this.getSetores();
  }

  // Carregar setores
  getSetores(): void {
    this.setorService.getSetores().subscribe((data) => {
      this.setores = data;
    });
  }

  // Submeter formulário
  onSubmit(): void {
    const setor = this.setorForm.value;
    
    if (this.setorEditId) {
      // Atualizar setor
      this.setorService.updateSetor(this.setorEditId, setor).subscribe(() => {
        this.getSetores(); // Recarregar lista de setores
        this.setorForm.reset();
        this.setorEditId = null;
      });
    } else {
      // Criar novo setor
      this.setorService.createSetor(setor).subscribe(() => {
        this.getSetores(); // Recarregar lista de setores
        this.setorForm.reset();
      });
    }
  }

  // Editar setor
  onEdit(setor: any): void {
    this.setorForm.setValue({ nome: setor.nome });
    this.setorEditId = setor.codigo;
  }

  // Deletar setor
  onDelete(id: number): void {
    this.setorService.deleteSetor(id).subscribe(() => {
      this.getSetores(); // Recarregar lista de setores
    });
  }
}
