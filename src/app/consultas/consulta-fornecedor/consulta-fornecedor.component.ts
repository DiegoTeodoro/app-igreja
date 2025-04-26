import { Component, OnInit } from '@angular/core';
import { FornecedorService } from '../../../services/fornecedor.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router'; // <<<<<< certo agora!

@Component({
  selector: 'app-consulta-fornecedor',
  templateUrl: './consulta-fornecedor.component.html',
  styleUrls: ['./consulta-fornecedor.component.css']
})
export class ConsultaFornecedorComponent implements OnInit {
  pesquisaForm!: FormGroup;
  fornecedores: any[] = [];
  fornecedoresFiltrados: any[] = [];

  constructor(
    private fornecedorService: FornecedorService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.pesquisaForm = this.fb.group({
      pesquisa: ['']
    });
    this.carregarFornecedores();
  }

  carregarFornecedores(): void {
    this.fornecedorService.getFornecedores().subscribe((fornecedores: any[]) => {
      this.fornecedores = fornecedores;
      this.fornecedoresFiltrados = fornecedores;
    });
  }

  selecionarFornecedor(fornecedor: any): void {
    localStorage.setItem('fornecedorSelecionado', JSON.stringify(fornecedor));
    this.router.navigate(['/fornecedor']);
  }

  pesquisar(): void {
    const termoPesquisa = this.pesquisaForm.get('pesquisa')?.value?.toLowerCase().trim() || '';
    if (termoPesquisa) {
      this.fornecedoresFiltrados = this.fornecedores.filter(fornecedor =>
        fornecedor.razao_social?.toLowerCase().includes(termoPesquisa) ||
        fornecedor.nome_fantasia?.toLowerCase().includes(termoPesquisa) ||
        fornecedor.cnpj?.toLowerCase().includes(termoPesquisa)
      );
    } else {
      this.fornecedoresFiltrados = this.fornecedores;
    }
  }
}
