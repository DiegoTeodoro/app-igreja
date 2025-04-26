import { Component } from '@angular/core';
import { FornecedorService } from '../../../services/fornecedor.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-cadastro-fornecedor',
  templateUrl: './cadastro-fornecedor.component.html',
  styleUrls: ['./cadastro-fornecedor.component.css']
})
export class CadastroFornecedorComponent {
  fornecedorForm!: FormGroup<any>;
  //fornecedorForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private fornecedorService: FornecedorService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.fornecedorForm = this.fb.group({
      razao_social: [''],
      nome_fantasia: [''],
      cnpj: [''],
      inscricao_estadual: [''],
      telefone_fixo: [''],
      telefone_celular: [''],
      email: [''],
      logradouro: [''],
      numero: [''],
      complemento: [''],
      bairro: [''],
      cep: [''],
      cidade_codigo: [null],
      uf_codigo: [null],
      ativo: [true] 
    });
  }

  salvar(): void {
    if (this.fornecedorForm.valid) {
      this.fornecedorService.createFornecedor(this.fornecedorForm.value).subscribe(() => {
        this.snackBar.open('Fornecedor salvo com sucesso!', 'Fechar', { duration: 3000 });
        this.fornecedorForm.reset({ ativo: true });
      }, () => {
        this.snackBar.open('Erro ao salvar fornecedor', 'Fechar', { duration: 3000 });
      });
    }
  }

  cancelar(): void {
    this.fornecedorForm.reset({ ativo: true });
  }

  verificarAtivo(): void {
    const ativo = this.fornecedorForm.get('ativo')?.value;
  
    if (ativo) {
      this.fornecedorForm.enable(); // Habilita tudo
    } else {
      // Desabilita todos os campos, exceto o radio button 'ativo'
      Object.keys(this.fornecedorForm.controls).forEach(field => {
        if (field !== 'ativo') {
          this.fornecedorForm.get(field)?.disable();
        }
      });
    }
  }
}
