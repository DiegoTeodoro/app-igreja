import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProdutoService } from '../produto.service';
import { Produto } from '../models/produto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-cadastro-produto',
  templateUrl: './cadastro-produto.component.html',
  styleUrls: ['./cadastro-produto.component.css']
})
export class CadastroProdutoComponent implements OnInit {
  produtoForm: FormGroup;
  produto: any;
  categorias: any;
  fornecedores: any;
  showSuccessMessage = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private produtoService: ProdutoService
  ) {
    this.produtoForm = this.fb.group({
      id: [null],
      nome: ['', Validators.required],
      marca: ['', Validators.required],
      codigo_barras: ['', Validators.required],
      volume: ['', Validators.required],
      categoria_id: [null, Validators.required],
      fornecedor_id: [null, Validators.required],
      observacao: ['']
    });
    this.produtoForm.reset({
      id: null,
      nome: '',
      marca: '',
      codigo_barras: '',
      volume: '',
      categoria_id: null,
      fornecedor_id: null,
      observacao: ''
    });
  }

  ngOnInit(): void {
    // Carrega as categorias
    this.produtoService.getCategorias().subscribe((categorias: any) => {
      this.categorias = categorias;
    });

    // Carrega os fornecedores
    this.produtoService.getFornecedores().subscribe((fornecedores: any) => {
      this.fornecedores = fornecedores;
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.produtoService.getProdutoById(+id).subscribe((produto: Produto) => {
        this.produtoForm.patchValue(produto);
      });
    }
  }

  onSubmit(): void {
    if (this.produtoForm.valid) {
      const produto = this.produtoForm.value;
      if (produto.id) {
        this.produtoService.updateProduto(produto.id, produto).subscribe(() => {
          this.showSuccessMessage = true;
          this.produtoForm.reset(); // Limpa o formulário após a edição
          this.resetSuccessMessage(); // Reseta a mensagem de sucesso após um tempo
        });
      } else {
        this.produtoService.createProduto(produto).subscribe(() => {
          this.showSuccessMessage = true;
          this.produtoForm.reset(); // Limpa o formulário após a criação
          this.resetSuccessMessage(); // Reseta a mensagem de sucesso após um tempo
        });
      }
    }
  }

  resetSuccessMessage(): void {
    setTimeout(() => {
      this.showSuccessMessage = false;
    }, 3000); // Mensagem desaparece após 3 segundos
  }
}
