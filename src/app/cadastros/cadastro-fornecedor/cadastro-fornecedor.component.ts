import { Component } from '@angular/core';
import { FornecedorService } from '../../../services/fornecedor.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CidadeService } from '../../../services/cidade.service'; 
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-cadastro-fornecedor',
  templateUrl: './cadastro-fornecedor.component.html',
  styleUrls: ['./cadastro-fornecedor.component.css']
})

export class CadastroFornecedorComponent {
  fornecedorForm!: FormGroup<any>;
  cidades: any[] = [];

  constructor(
    private fb: FormBuilder,
    private fornecedorService: FornecedorService,
    private cidadeService: CidadeService,
    private snackBar: MatSnackBar,
    private router: Router // 👈 adiciona o Router aqui
  ) {}

  ngOnInit(): void {
    this.fornecedorForm = this.fb.group({
      id: [null], 
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
    
  
    this.loadCidades();
  
    const fornecedorSelecionado = localStorage.getItem('fornecedorSelecionado');
    if (fornecedorSelecionado) {
      const fornecedor = JSON.parse(fornecedorSelecionado);
      this.fornecedorForm.patchValue(fornecedor);
  
      // Se quiser, limpa o localStorage depois que carregar
      localStorage.removeItem('fornecedorSelecionado');
    }
  }
  
  loadCidades(): void {
    this.cidadeService.getCidades().subscribe(data => {
      this.cidades = data;
    });
  }

  onCidadeChange(cidadeId: number): void {
    const cidadeSelecionada = this.cidades.find(c => c.id === cidadeId);
    if (cidadeSelecionada) {
      this.fornecedorForm.patchValue({
        uf_codigo: cidadeSelecionada.estado_id
      });
    }
  }

  salvar(): void {
    if (this.fornecedorForm.valid) {
      const fornecedorData = this.fornecedorForm.value;
  
      if (fornecedorData.id) {
        // Atualizar fornecedor existente
        this.fornecedorService.updateFornecedor(fornecedorData.id, fornecedorData).subscribe(() => {
          this.snackBar.open('Fornecedor atualizado com sucesso!', 'Fechar', { duration: 3000 });
          this.fornecedorForm.reset({ ativo: true });
        }, () => {
          this.snackBar.open('Erro ao atualizar fornecedor', 'Fechar', { duration: 3000 });
        });
  
      } else {
        // Criar novo fornecedor
        this.fornecedorService.createFornecedor(fornecedorData).subscribe(() => {
          this.snackBar.open('Fornecedor salvo com sucesso!', 'Fechar', { duration: 3000 });
          this.fornecedorForm.reset({ ativo: true });
        }, () => {
          this.snackBar.open('Erro ao salvar fornecedor', 'Fechar', { duration: 3000 });
        });
      }
    }
  }

  cancelar(): void {
    this.fornecedorForm.reset({ ativo: true });
  }

  verificarAtivo(): void {
    const ativo = this.fornecedorForm.get('ativo')?.value;
    if (ativo) {
      this.fornecedorForm.enable();
    } else {
      Object.keys(this.fornecedorForm.controls).forEach(field => {
        if (field !== 'ativo') {
          this.fornecedorForm.get(field)?.disable();
        }
      });
    }
  }

  abrirConsultaFornecedor(): void {
    this.router.navigate(['/consulta-fornecedor']);
  }
}
