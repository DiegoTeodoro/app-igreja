import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventarioService } from '../Inventario.Service';
import { Inventario } from '../models/inventario';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {
  inventarioForm: FormGroup;
  produtos: any[] = [];
  filteredProdutos: any[] = [];

  constructor(private fb: FormBuilder, @Inject(InventarioService) private inventarioService: InventarioService) {
    this.inventarioForm = this.fb.group({
      produto_id: ['', Validators.required],  // Mantém o ID do produto aqui
      produto_nome: ['', Validators.required],  // Campo de nome do produto para exibição
      usuario_id: ['', Validators.required],
      quantidade: ['', [Validators.required, Validators.min(1)]],
      data: [new Date(), Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadProdutos();
  }

  loadProdutos(): void {
    this.inventarioService.getProdutos().subscribe((data: any[]) => {
      this.produtos = data;
      this.filteredProdutos = data; // Inicialmente, todos os produtos estão na lista filtrada
    });
  }

  filterProdutos(): void {
    const searchValue = this.inventarioForm.get('produto_nome')?.value?.toLowerCase();
    if (searchValue) {
      this.filteredProdutos = this.produtos.filter(produto => 
        produto.nome.toLowerCase().includes(searchValue)
      );
    } else {
      this.filteredProdutos = this.produtos;
    }
  }

  onProdutoSelected(event: any): void {
    const selectedProduto = this.produtos.find(produto => produto.nome === event.option.value);
    if (selectedProduto) {
      this.inventarioForm.patchValue({
        produto_id: selectedProduto.id  // Atualiza o produto_id com base na seleção
      });
    }
  }

  saveInventario(): void {
    if (this.inventarioForm.valid) {
      const inventarioData: Inventario = this.inventarioForm.value;
      this.inventarioService.updateSaldoEstoque(inventarioData).subscribe(
        () => {
          alert('Estoque atualizado com sucesso!');
          this.inventarioForm.reset();
        },
        (error) => {
          console.error('Erro ao atualizar estoque', error);
        }
      );
    }
  }
}
