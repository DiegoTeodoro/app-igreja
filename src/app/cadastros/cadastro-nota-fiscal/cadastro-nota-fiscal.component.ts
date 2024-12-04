import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { NotaFiscalService } from '../../../services/nota-fiscal.service'; // Importando o serviço
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro-nota-fiscal',
  templateUrl: './cadastro-nota-fiscal.component.html',
  styleUrls: ['./cadastro-nota-fiscal.component.css'],
})
export class CadastroNotaFiscalComponent implements OnInit {

  notaFiscalForm: FormGroup;
  itens = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['nomeProduto', 'quantidade', 'valorUnitario', 'valorTotal', 'acoes'];
  fornecedores: any[] = [];
  produtos: any[] = [];
  showSuccessMessage: boolean = false; // Variável para controlar a mensagem de sucesso
  mensagemSucesso: any;
  numeroNotaPesquisa: string = ''; // Armazena o número da nota para pesquisa
  itemEditando: any = null; // Variável para armazenar o item em edição
  constructor(
    private fb: FormBuilder,
    private notaFiscalService: NotaFiscalService, 
    private snackBar: MatSnackBar, 
    private dialog: MatDialog, // Injetar MatDialog aqui
    private router: Router
  ) {
    this.notaFiscalForm = this.fb.group({
      numeroNotaPesquisa: [''],
      numeroNota: [''],
      serie: [''],
      chaveAcesso: [''],
      fornecedor: [''],
      dataEmissao: [''],
      observacao: [''],
      produto: [''],
      quantidade: [''],
      valorUnitario: [''],
      valorTotalProduto: [''],
      desconto: [''],
      outros: [''],
      valorTotalNota: ['']
    });
  }

  ngOnInit(): void {
    this.carregarFornecedores();
    this.carregarProdutos();
  }

  carregarFornecedores(): void {
    this.notaFiscalService.getFornecedores().subscribe(
      (data: any[]) => {
        this.fornecedores = data;
        console.log('Fornecedores carregados:', this.fornecedores);
      },
      (error: any) => {
        console.error('Erro ao carregar fornecedores:', error);
      }
    );
  }

  carregarProdutos(): void {
    this.notaFiscalService.getProdutos().subscribe(
      (data: any[]) => {
        this.produtos = data;
        console.log('Produtos carregados:', this.produtos);
      },
      (error: any) => {
        console.error('Erro ao carregar produtos:', error);
      }
    );
  }

  atualizarValorTotal(): void {
    const valorUnitario = this.notaFiscalForm.get('valorUnitario')?.value || 0;
    const quantidade = this.notaFiscalForm.get('quantidade')?.value || 0;
    const valorTotal = valorUnitario * quantidade;
    this.notaFiscalForm.patchValue({ valorTotalProduto: valorTotal });
  }

  adicionarItem(): void {
    const valorUnitario = this.notaFiscalForm.value.valorUnitario;
    const quantidade = this.notaFiscalForm.value.quantidade;

    // Verificar se os valores são válidos
    if (valorUnitario === null || valorUnitario <= 0 || quantidade === null || quantidade <= 0) {
        console.error("Erro: Valor Unitário ou Quantidade inválidos.");
        this.snackBar.open("Valor Unitário e Quantidade devem ser maiores que zero.", "Fechar", {
            duration: 3000,
        });
        return;
    }

    const item = {
        nomeProduto: this.produtos.find(p => p.id === this.notaFiscalForm.value.produto)?.nome,
        produto_id: this.notaFiscalForm.value.produto,
        quantidade: quantidade,
        valorUnitario: valorUnitario,
        valorTotal: quantidade * valorUnitario
    };

    this.itens.data = [...this.itens.data, item];

    this.notaFiscalForm.patchValue({
        produto: '',
        quantidade: '',
        valorUnitario: '',
        valorTotalProduto: ''
    });

    this.calcularValorTotalNota();
}


  calcularValorTotalNota(): void {
    const desconto = this.notaFiscalForm.value.desconto || 0;
    const outros = this.notaFiscalForm.value.outros || 0;
    const valorItens = this.itens.data.reduce((total, item) => total + item.valorTotal, 0);
    const valorTotalNota = valorItens - desconto + outros;
    this.notaFiscalForm.patchValue({ valorTotalNota: valorTotalNota });
}

salvarNotaFiscal(): void {
  const dataEmissao = this.formatarData(this.notaFiscalForm.value.dataEmissao);

  const notaFiscal = {
      numero_nota: this.notaFiscalForm.value.numeroNota,
      serie: this.notaFiscalForm.value.serie,
      chave_acesso: this.notaFiscalForm.value.chaveAcesso,
      fornecedor_id: this.notaFiscalForm.value.fornecedor,
      data_emissao: dataEmissao,
      valor_total: this.notaFiscalForm.value.valorTotalNota || 0,
      desconto: this.notaFiscalForm.value.desconto || 0,
      outros: this.notaFiscalForm.value.outros || 0,
      observacoes: this.notaFiscalForm.value.observacao || '',
      itensNotaFiscal: this.itens.data
  };

  console.log("Nota Fiscal a ser salva:", notaFiscal);  // Log para verificar os dados

  this.notaFiscalService.salvarNotaFiscal(notaFiscal).subscribe(
      (response: any) => {
          this.snackBar.open('Nota Fiscal salva com sucesso!', 'Fechar', { duration: 3000 });
          this.notaFiscalForm.reset();
          this.itens.data = [];
          this.notaFiscalForm.patchValue({ valorTotalNota: 0 });
      },
      (error: any) => {
          console.error('Erro ao salvar nota fiscal:', error);
          this.snackBar.open('Erro ao salvar a Nota Fiscal!', 'Fechar', { duration: 3000 });
      }
  );
}


  consultarNotaFiscal(): void {
    const numeroNota = this.notaFiscalForm.get('numeroNotaPesquisa')?.value;
    if (!numeroNota) {
      this.snackBar.open('Informe o número da nota para consulta.', 'Fechar', {
        duration: 3000,
      });
      return;
    }

    this.notaFiscalService.getNotaFiscalByNumero(numeroNota).subscribe(
      (notas: any[]) => {
        if (notas.length > 0) {
          const nota = notas[0];
          this.notaFiscalForm.patchValue({
            numeroNota: nota.numero_nota,
            serie: nota.serie,
            chaveAcesso: nota.chave_acesso,
            fornecedor: nota.fornecedor_id,
            dataEmissao: new Date(nota.data_emissao),
            observacao: nota.observacoes,
            valorTotalNota: nota.valor_total
          });
          this.carregarItensNotaFiscal(nota.id);
        } else {
          this.snackBar.open('Nota Fiscal não encontrada.', 'Fechar', {
            duration: 3000,
          });
        }
      },
      (error: any) => {
        console.error('Erro ao consultar nota fiscal:', error);
        this.snackBar.open('Erro ao consultar a Nota Fiscal.', 'Fechar', {
          duration: 3000,
        });
      }
    );
  }

  carregarItensNotaFiscal(notaFiscalId: number): void {
    this.notaFiscalService.getItensNotaFiscal(notaFiscalId).subscribe(
      (itens: any[]) => {
        this.itens.data = itens.map(item => ({
          produto_id: item.produto_id,
          nomeProduto: this.produtos.find(p => p.id === item.produto_id)?.nome || '',
          quantidade: item.quantidade,
          valorUnitario: item.valor_unitario,
          valorTotal: item.valor_total
        }));
        this.calcularValorTotalNota();
      },
      (error: any) => {
        console.error('Erro ao carregar itens da nota fiscal:', error);
        this.snackBar.open('Erro ao carregar itens da nota fiscal.', 'Fechar', { duration: 3000 });
      }
    );
  }
  
  
  editarItem(item: any): void {
    this.itemEditando = item;
    this.notaFiscalForm.patchValue({
      produto: item.produto_id,
      quantidade: item.quantidade,
      valorUnitario: item.valorUnitario,
      valorTotalProduto: item.valorTotal
    });
  }

  confirmarRemoverItem(item: any): void {
    this.itens.data = this.itens.data.filter(i => i !== item);
    this.calcularValorTotalNota();
    this.snackBar.open("Item removido com sucesso.", "Fechar", { duration: 3000 });
  }

  
  formatarData(data: Date): string {
    const d = new Date(data);
    const ano = d.getFullYear();
    const mes = ('0' + (d.getMonth() + 1)).slice(-2);
    const dia = ('0' + d.getDate()).slice(-2);
    return `${ano}-${mes}-${dia}`;
  }

  pesquisarNota(): void {
    const numeroNota = this.numeroNotaPesquisa;
    if (!numeroNota) {
      this.snackBar.open('Informe o número da nota para pesquisa.', 'Fechar', { duration: 3000 });
      return;
    }
  
    this.notaFiscalService.getNotaFiscalByNumero(numeroNota).subscribe(
      (notas: any[]) => {
        if (notas.length > 0) {
          const nota = notas[0];
          this.notaFiscalForm.patchValue({
            numeroNota: nota.numero_nota,
            serie: nota.serie,
            chaveAcesso: nota.chave_acesso,
            fornecedor: nota.fornecedor_id,
            dataEmissao: new Date(nota.data_emissao),
            observacao: nota.observacoes,
            valorTotalNota: nota.valor_total
          });
          this.carregarItensNotaFiscal(nota.id);
        } else {
          this.snackBar.open('Nota Fiscal não encontrada.', 'Fechar', { duration: 3000 });
        }
      },
      (error: any) => {
        console.error('Erro ao consultar nota fiscal:', error);
        this.snackBar.open('Erro ao consultar a Nota Fiscal.', 'Fechar', { duration: 3000 });
      }
    );
  }
  

  cancelar(): void {
    this.notaFiscalForm.reset();
    this.itens.data = [];
    this.notaFiscalForm.patchValue({ valorTotalNota: 0 });
  }
}

