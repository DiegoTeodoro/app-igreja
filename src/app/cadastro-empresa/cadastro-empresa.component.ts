import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  constructor(private fb: FormBuilder) {
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

  onSubmit(): void {
    if (this.empresaForm.valid) {
      // Lógica para salvar a empresa
      console.log('Empresa salva:', this.empresaForm.value);
    }
  }

  pesquisarEmpresa(): void {
    this.isSearchMode = true;
  }

  voltarCadastro(): void {
    this.isSearchMode = false;
  }

  selectEmpresa(empresa: any): void {
    this.isSearchMode = false;
    // Preencher o formulário com os dados da empresa selecionada
    this.empresaForm.patchValue(empresa);
  }
}
