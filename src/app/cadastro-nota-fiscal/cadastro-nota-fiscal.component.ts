import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";  // Importar MatSnackBar
import { FornecedorService } from "../fornecedor.service";
import { ProdutoService } from "../produto.service";
import { debounceTime, switchMap, map } from "rxjs/operators";
import { Observable } from "rxjs";
import { Produto } from "../models/produto";
import { NotaFiscalService } from '../nota-fiscal.service';

@Component({
  selector: "app-cadastro-nota-fiscal",
  templateUrl: "./cadastro-nota-fiscal.component.html",
  styleUrls: ["./cadastro-nota-fiscal.component.css"],
})
export class CadastroNotaFiscalComponent implements OnInit {
  notaFiscalForm!: FormGroup;
  fornecedores: { id: number; nome_fantasia: string }[] = [];
  produtos: { id: number; nome: string }[] = [];
  displayedColumns: string[] = [
    "produto",
    "quantidade",
    "valor_unitario",
    "valor_total",
    "actions",
  ];
  dataSource: any[] = [];
  produtoControl = new FormControl();
  filteredProdutos: Observable<Produto[]> | undefined;

  constructor(
    private fb: FormBuilder,
    private fornecedorService: FornecedorService,
    private produtoService: ProdutoService,
    private notaFiscalService: NotaFiscalService,
    private snackBar: MatSnackBar  // Inject MatSnackBar
  ) {}

  cancelar(): void {
    this.notaFiscalForm.reset({
      numero_nota: '',
      serie: '',
      chave_acesso: '',
      fornecedor_id: '',
      data_emissao: '',
      quantidade: '',
      valor_unitario: '',
      valor_total: '',
      valor_total_nota: '',
      valor_desconto: 0,
      valor_outros: 0
    });
  
    // Limpa também a lista de itens da tabela
    this.dataSource = [];
  }
  

  salvarNotaFiscal() {
    if (this.notaFiscalForm.invalid) {
      this.snackBar.open('Alguns campos obrigatórios estão sem informação.', 'Fechar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
      return;
    }
  
    const notaFiscalData = this.notaFiscalForm.value;
  
    // Formatar data de emissão para o formato 'YYYY-MM-DD'
    const dataEmissao = new Date(notaFiscalData.data_emissao).toISOString().slice(0, 10);
    notaFiscalData.data_emissao = dataEmissao;
  
    notaFiscalData.itens = this.dataSource;
  
    this.notaFiscalService.salvarNotaFiscal(notaFiscalData).subscribe(
      (response) => {
        console.log('Nota fiscal salva com sucesso:', response);
        
        this.snackBar.open('Nota fiscal salva com sucesso!', 'Fechar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
    
        // Limpa o formulário após salvar
        this.notaFiscalForm.reset({
          numero_nota: '',
          serie: '',
          chave_acesso: '',
          fornecedor_id: '',
          data_emissao: '',
          quantidade: '',
          valor_unitario: '',
          valor_total: '',
          valor_total_nota: '',
          valor_desconto: 0,
          valor_outros: 0
        });
    
        // Limpa os itens da tabela
        this.notaFiscalForm.setControl('itens', this.fb.array([]));
        this.dataSource = [];
      },
      (error) => {
        console.error('Erro ao salvar nota fiscal:', error);
        this.snackBar.open('Erro ao salvar a nota fiscal. Tente novamente.', 'Fechar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    );
    
  }
  
  ngOnInit(): void {
    this.notaFiscalForm = this.fb.group({
      numero_nota: ["", Validators.required],
      serie: [""],
      chave_acesso: [""],
      fornecedor_id: ["", Validators.required],
      data_emissao: ["", Validators.required],
      quantidade: [""],
      valor_unitario: [""],
      valor_total: [{ value: "", disabled: true }],
      valor_total_nota: [{ value: '', disabled: true }],
      valor_desconto: [0],
      valor_outros: [0],
      valor_total_produtos: [0],
      desconto: [0],
      outros: [0],
      itens: this.fb.array([]),
    });

    this.produtoControl = this.fb.control('');

    this.fornecedorService.getFornecedores().subscribe((data: any) => {
      this.fornecedores = data;
    });

    this.filteredProdutos = this.produtoControl.valueChanges.pipe(
      debounceTime(300),
      switchMap((value) => this._filter(value))
    );
  }

  private _filter(value: string): Observable<Produto[]> {
    const filterValue = typeof value === "string" ? value.toLowerCase() : "";

    return this.produtoService
      .getProdutos()
      .pipe(
        map((produtos: Produto[]) =>
          produtos.filter((produto) =>
            produto.nome.toLowerCase().includes(filterValue)
          )
        )
      );
  }

  displayProduto(produto: Produto): string {
    return produto && produto.nome ? produto.nome : "";
  }

  addItem() {
    const produto = this.produtoControl.value;
    const quantidade = this.notaFiscalForm.get("quantidade")?.value;
    const valorUnitario = this.notaFiscalForm.get("valor_unitario")?.value;
    const valorTotal = quantidade * valorUnitario;
  
    if (produto && quantidade && valorUnitario) {
      const newItem = {
        produto_id: produto.id,
        produto_nome: produto.nome,
        quantidade: quantidade,
        valor_unitario: valorUnitario,
        valor_total: valorTotal,
        quantidadeControl: new FormControl(quantidade, [
          Validators.required,
          Validators.min(1),
        ]),
        valorUnitarioControl: new FormControl(valorUnitario, Validators.required),
      };
  
      this.dataSource.push(newItem);
      this.dataSource = [...this.dataSource];  // Para atualizar a tabela
      this.calcularTotalNota();
    }
  
    // Limpar os campos do formulário após adicionar o item
    this.notaFiscalForm.patchValue({
      quantidade: '',
      valor_unitario: '',
      valor_total: '',
    });
    this.produtoControl.setValue('');
  }
  
  editItem(index: number) {
    const item = this.dataSource[index];
  
    this.produtoControl.setValue(item.produto_nome);
    this.notaFiscalForm.patchValue({
      quantidade: item.quantidade,
      valor_unitario: item.valor_unitario,
      valor_total: item.valor_total,
    });
  
    // Remover o item da tabela para substituí-lo após a edição
    this.dataSource.splice(index, 1);
    this.dataSource = [...this.dataSource];
  }
  
  updateValorTotal() {
    const quantidade = this.notaFiscalForm.get("quantidade")?.value || 0;
    const valorUnitario = this.notaFiscalForm.get("valor_unitario")?.value || 0;

    const valorTotal = quantidade * valorUnitario;

    this.notaFiscalForm.patchValue({ valor_total: valorTotal.toFixed(2) });
  }

  calcularTotalNota(): void {
    const totalProdutos = this.dataSource.reduce(
      (acc, item) => acc + (item.valor_total || 0),
      0
    );

    this.notaFiscalForm.patchValue({ valor_total_nota: totalProdutos.toFixed(2) });
  }

  removeItem(index: number) {
    if (index >= 0 && index < this.dataSource.length) {
      this.dataSource.splice(index, 1);
      this.dataSource = [...this.dataSource];
      this.calcularTotalNota();
    } else {
      console.error("Índice inválido para remoção:", index);
    }
  }

  onFornecedorChange(fornecedorId: number): void {
    const fornecedorSelecionado = this.fornecedores.find(f => f.id === fornecedorId);

    if (fornecedorSelecionado) {
      this.notaFiscalForm.patchValue({ fornecedor_id: fornecedorSelecionado.id });
    }
  }
}