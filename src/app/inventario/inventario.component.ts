import { Component, OnInit, Inject, TrackByFunction } from '@angular/core';
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
  inventarios: any[] = [];
  produtos: any[] = [];
  filteredProdutos: any[] = [];
  displayedColumns: string[] = ['produto', 'quantidade'];

  trackByFn(index: number, item: any): any {
    return item.produto_id;
  }
  
  constructor(private fb: FormBuilder, @Inject(InventarioService) private inventarioService: InventarioService) {
    this.inventarioForm = this.fb.group({
      usuario_id: [{ value: '', disabled: true }, Validators.required], // Este deve conter o ID numérico
      data: [new Date(), Validators.required],
      produto_nome: ['', Validators.required],
      produto_id: ['', Validators.required],
      quantidade: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadProdutos();
    this.setUsuario();
  }

  loadProdutos(): void {
    this.inventarioService.getProdutos().subscribe((data: any[]) => {
      this.produtos = data;
      this.filteredProdutos = data; // Inicialmente, todos os produtos estão na lista filtrada
    });
  }

  setUsuario(): void {
    const usuarioLogadoData = localStorage.getItem('usuarioLogado');
    if (usuarioLogadoData) {
      const usuarioLogado = JSON.parse(usuarioLogadoData);
      this.inventarioForm.patchValue({ usuario_id: usuarioLogado.id });
    }
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
        produto_id: selectedProduto.id
      });
    }
  }

  addProduto(): void {
    if (this.inventarioForm.valid) {
      const produtoData = {
        produto_id: this.inventarioForm.get('produto_id')?.value,
        produto_nome: this.inventarioForm.get('produto_nome')?.value,
        quantidade: this.inventarioForm.get('quantidade')?.value
      };
      this.inventarios = [...this.inventarios, produtoData];
      this.inventarioForm.patchValue({ produto_nome: '', produto_id: '', quantidade: '' });
    }
  }

  formatDateToMySQL(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  saveInventario(): void {
    if (this.inventarios.length > 0) {
      const inventarioData = this.inventarios.map((element) => ({
        produto_id: element.produto_id,
        quantidade: element.quantidade,
        data: this.formatDateToMySQL(new Date(this.inventarioForm.get('data')?.value)),
        usuario_id: this.inventarioForm.get('usuario_id')?.value
      }));
  
      this.inventarioService.saveInventario(inventarioData).subscribe(
        (response) => {
          console.log(response.message); // Mensagem de sucesso do servidor
          alert('Inventário salvo com sucesso!');
          this.inventarioForm.reset();
          this.inventarios = [];
          this.setUsuario(); // Repopular o usuário no formulário
          location.reload(); // Recarrega a página
        },
        (error) => {
          console.error('Erro ao salvar inventário', error);
        }
      );
    } else {
      alert('Nenhum item foi adicionado ao inventário.');
    }
  }
  
  
}
