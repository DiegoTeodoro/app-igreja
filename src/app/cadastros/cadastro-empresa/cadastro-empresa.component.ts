import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmpresaService } from '../../../services/empresa.service'; // Importe o serviço Empresa

@Component({
  selector: 'app-cadastro-empresa',
  templateUrl: './cadastro-empresa.component.html',
  styleUrls: ['./cadastro-empresa.component.css']
})
export class CadastroEmpresaComponent implements OnInit {
  empresaForm: FormGroup;
  isSearchMode: boolean = false;
  empresas = []; // Lista de empresas para o modo de pesquisa
  displayedColumns: string[] = ['razao_social', 'endereco', 'numero', 'bairro'];

  constructor(private fb: FormBuilder, private empresaService: EmpresaService) {
    // Inicializar o FormGroup no construtor
    this.empresaForm = this.fb.group({
      razao_social: ['', Validators.required],
      cnpj: ['', Validators.required],
      endereco: ['', Validators.required],
      numero: ['', Validators.required],
      bairro: ['', Validators.required],
      telefone: ['', Validators.required],
      cep: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  // Função para salvar a empresa
  onSubmit(): void {
    if (this.empresaForm.valid) {
      this.empresaService.cadastrarEmpresa(this.empresaForm.value).subscribe(
        (response) => {
          console.log('Empresa salva com sucesso', response);
          this.empresaForm.reset();
        },
        (error) => {
          console.error('Erro ao salvar a empresa', error);
        }
      );
    }
  }

  // Função para pesquisar empresas
  pesquisarEmpresa(): void {
    const filtros = {
      razao_social: this.empresaForm.get('razao_social')?.value,
      cnpj: this.empresaForm.get('cnpj')?.value
    };

    this.empresaService.pesquisarEmpresas(filtros).subscribe(
      (response) => {
        this.empresas = response;
        this.isSearchMode = true;
      },
      (error) => {
        console.error('Erro ao pesquisar empresas', error);
      }
    );
  }

  // Voltar ao formulário de cadastro
  voltarCadastro(): void {
    this.isSearchMode = false;
    this.empresas = [];
  }

  // Selecionar uma empresa e preencher o formulário
  selectEmpresa(empresa: any): void {
    this.isSearchMode = false;
    this.empresaForm.patchValue(empresa);
  }
}
