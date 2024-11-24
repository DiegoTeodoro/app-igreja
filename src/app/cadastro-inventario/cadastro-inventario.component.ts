import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { InventarioService } from '../Inventario.Service';

@Component({
  selector: 'app-cadastro-inventario',
  templateUrl: './cadastro-inventario.component.html',
  styleUrls: ['./cadastro-inventario.component.css'],
})
export class CadastroInventarioComponent implements OnInit {
  inventarioForm!: FormGroup;
  produtos: any[] = [];
  userName: string | null = null; // Variável para armazenar o nome do usuário
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['produto', 'quantidade', 'acoes'];

  constructor(
    private fb: FormBuilder,
    private inventarioService: InventarioService
  ) {}

  ngOnInit(): void {
    // Obtenha o nome do usuário logado do localStorage
    this.userName = localStorage.getItem('userName');

    this.inventarioForm = this.fb.group({
      produto_id: [null, Validators.required],
      usuario_id: [localStorage.getItem('userId') || null, Validators.required], // Preenche com o ID do usuário logado
      quantidade: [null, [Validators.required, Validators.min(1)]],
      observacao: [''],
      data: [this.getCurrentDate(), Validators.required], // Inicializa com a data atual
    });

    this.loadProdutos();
  }

  getCurrentDate(): string {
    const now = new Date();
    return now.toISOString().split('T')[0]; // Retorna no formato 'YYYY-MM-DD'
  }

  loadProdutos(): void {
    this.inventarioService.getProdutos().subscribe((data) => {
      this.produtos = data;
    });
  }

  adicionarProduto(): void {
    const produtoId = this.inventarioForm.value.produto_id;
    const produto = this.produtos.find((p) => p.id === produtoId);
    const quantidade = this.inventarioForm.value.quantidade;

    if (produto && quantidade > 0) {
      const data = this.dataSource.data;
      data.push({
        produtoId,
        produtoNome: produto.nome,
        quantidade,
      });
      this.dataSource.data = data;

      this.inventarioForm.patchValue({ produto_id: null, quantidade: null });
    }
  }

  removerProduto(element: any): void {
    this.dataSource.data = this.dataSource.data.filter(
      (item) => item !== element
    );
  }

  editarProduto(element: any): void {
    this.inventarioForm.patchValue({
      produto_id: element.produtoId,
      quantidade: element.quantidade,
    });

    this.removerProduto(element);
  }

  onSubmit(): void {
    if (this.dataSource.data.length === 0) {
      alert('Adicione pelo menos um produto.');
      return;
    }

    const inventarioData = this.dataSource.data.map((item) => ({
      produto_id: item.produtoId,
      usuario_id: this.inventarioForm.value.usuario_id, // Envia o ID do usuário
      quantidade: item.quantidade,
      observacao: this.inventarioForm.value.observacao,
      data_inventario: this.inventarioForm.value.data, // Atualizado para o nome correto
    }));

    this.inventarioService.saveInventario(inventarioData).subscribe(
      (response) => {
        alert('Inventário salvo com sucesso!');
        this.onReset();
      },
      (error) => {
        console.error('Erro ao salvar inventário:', error);
        alert('Erro ao salvar inventário.');
      }
    );
  }

  onReset(): void {
    this.inventarioForm.reset({
      data: this.getCurrentDate(),
    });
    this.dataSource.data = [];
  }
}
