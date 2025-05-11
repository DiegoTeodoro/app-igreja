import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { InventarioService } from "../../../services/Inventario.Service";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";

@Component({
  selector: "app-cadastro-inventario",
  templateUrl: "./cadastro-inventario.component.html",
  styleUrls: ["./cadastro-inventario.component.css"],
})
export class CadastroInventarioComponent implements OnInit {
  inventarioForm!: FormGroup;
  produtoControl = new FormControl(""); // Control para autocomplete
  produtos: any[] = [];
  filteredProdutos: Observable<any[]> = new Observable();
  userName: string | null = null;
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ["produto", "quantidade", "acoes"];

  constructor(
    private fb: FormBuilder,
    private inventarioService: InventarioService
  ) {}

  ngOnInit(): void {
    this.userName = localStorage.getItem('userName');

    this.inventarioForm = this.fb.group({
      produto_id: [null, Validators.required],
      usuario_id: [localStorage.getItem('userId') || null, Validators.required],
      quantidade: [null, [Validators.required, Validators.min(1)]],
      observacao: [''],
      data: [this.getCurrentDate(), Validators.required], // Inicializando a data
    });

    if (!localStorage.getItem('userId')) {
      alert('Usuário não está logado. Por favor, faça login novamente.');
    }

    this.loadProdutos();

    this.filteredProdutos = this.produtoControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterProdutos(value || ''))
    );
  }

  getCurrentDate(): string {
    const now = new Date();
    return now.toISOString().split("T")[0]; // Formato YYYY-MM-DD
  }

   // Método para carregar produtos
   loadProdutos(): void {
    this.inventarioService.getProdutos().subscribe((data) => {
      this.produtos = data;
    });
  }


   private _filterProdutos(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.produtos.filter((produto) =>
      produto.nome.toLowerCase().includes(filterValue)
    );
  }

  onProdutoSelected(event: any): void {
    const selectedProduto = this.produtos.find(
      (produto) => produto.nome === event.option.value
    );
    if (selectedProduto) {
      this.inventarioForm.patchValue({
        produto_id: selectedProduto.id,
        quantidade: null, // Limpa o campo quantidade, se necessário
      });
    }
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

      this.produtoControl.setValue('');
      this.inventarioForm.patchValue({ produto_id: null, quantidade: null });
    }
  }

  removerProduto(element: any): void {
    this.dataSource.data = this.dataSource.data.filter(
      (item) => item !== element
    );
  }

  onSubmit(): void {
    if (this.dataSource.data.length === 0) {
      alert('Adicione pelo menos um produto.');
      return;
    }
  
    const inventarioData = this.dataSource.data.map((item) => ({
      produto_id: item.produtoId,
      usuario_id: this.inventarioForm.value.usuario_id,
      quantidade: item.quantidade,
      observacao: this.inventarioForm.value.observacao,
      data_inventario: this.inventarioForm.value.data,
    }));
  
    this.inventarioService.saveInventario(inventarioData).subscribe(
      (response) => {
        alert('Inventário salvo com sucesso!');
        window.location.reload(); // <<<<<< ADICIONE ISTO
      },
      (error) => {
        console.error('Erro ao salvar inventário:', error);
        alert('Erro ao salvar inventário.');
      }
    );
  }
  

  onReset(): void {
    this.inventarioForm.reset({
      data: this.getCurrentDate(), // Reset para a data atual
    });
    this.produtoControl.setValue('');
    this.dataSource.data = [];
  }

  editarProduto(_t102: any) {
    throw new Error("Method not implemented.");
  }
}
