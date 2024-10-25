import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { NotaFiscalService } from '../nota-fiscal.service'; // Importando o serviço
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
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
  

  constructor(
    private fb: FormBuilder,
  private notaFiscalService: NotaFiscalService, 
  private snackBar: MatSnackBar, 
  private dialog: MatDialog, // Injetar MatDialog aqui
  private router: Router
  ) {
    this.notaFiscalForm = this.fb.group({
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
    
    // Verificar se há dados de nota fiscal na navegação
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.['notaFiscal']) {
      this.popularFormulario(navigation.extras.state['notaFiscal']);
    }
  }
  
  // Método para popular o formulário com os dados da nota fiscal
  popularFormulario(notaFiscal: any): void {
    this.notaFiscalForm.patchValue({
      numeroNota: notaFiscal.numero_nota,
      serie: notaFiscal.serie,
      chaveAcesso: notaFiscal.chave_acesso,
      fornecedor: notaFiscal.fornecedor_id,
      dataEmissao: new Date(notaFiscal.data_emissao), // Certifique-se de converter para Date se necessário
      observacao: notaFiscal.observacoes,
      valorTotalNota: notaFiscal.valor_total
    });
  
    // Supondo que os itens da nota fiscal também sejam passados, você pode carregar os itens na tabela
    if (notaFiscal.itensNotaFiscal) {
      this.itens.data = notaFiscal.itensNotaFiscal;
    }
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
  
    if (!valorUnitario || !quantidade) {
      console.error("Erro: Valor Unitário ou Quantidade inválidos.");
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

  formatarData(data: Date): string {
    const d = new Date(data);
    const ano = d.getFullYear();
    const mes = ('0' + (d.getMonth() + 1)).slice(-2);
    const dia = ('0' + d.getDate()).slice(-2);
    return `${ano}-${mes}-${dia}`;
  }

  salvarNotaFiscal(): void {
    const dataEmissao = this.formatarData(this.notaFiscalForm.value.dataEmissao);
    
    // Verifique se os campos obrigatórios estão preenchidos
    if (!this.notaFiscalForm.value.numeroNota || 
        !this.notaFiscalForm.value.serie || 
        !this.notaFiscalForm.value.chaveAcesso || 
        !dataEmissao || 
        !this.itens.data.length) {
      console.error('Campos obrigatórios ausentes.');
      this.snackBar.open('Preencha todos os campos obrigatórios.', 'Fechar', {
        duration: 3000,
      });
      return;
    }
  
    // Cria o objeto notaFiscal com os dados do formulário
    const notaFiscal = {
      numero_nota: this.notaFiscalForm.value.numeroNota,
      serie: this.notaFiscalForm.value.serie,
      chave_acesso: this.notaFiscalForm.value.chaveAcesso,
      fornecedor_id: this.notaFiscalForm.value.fornecedor,
      data_emissao: dataEmissao,
      valor_total: this.notaFiscalForm.value.valorTotalNota || 0,
      observacoes: this.notaFiscalForm.value.observacao || '',
      itensNotaFiscal: this.itens.data
    };
  
    // Envia a nota fiscal para o backend
    this.notaFiscalService.salvarNotaFiscal(notaFiscal).subscribe(
      (response: any) => {
        // Exibe uma mensagem de sucesso ao salvar a nota fiscal
        this.snackBar.open('Nota Fiscal salva com sucesso!', 'Fechar', {
          duration: 3000, // Duração de 3 segundos
        });
  
        // Limpa o formulário e a tabela de itens
        this.notaFiscalForm.reset();
        this.itens.data = []; // Limpa a tabela de itens
        this.notaFiscalForm.patchValue({ valorTotalNota: 0 }); // Reinicia o valor total da nota
      },
      (error: any) => {
        console.error('Erro ao salvar nota fiscal:', error);
  
        // Exibe uma mensagem de erro ao falhar o salvamento
        this.snackBar.open('Erro ao salvar a Nota Fiscal!', 'Fechar', {
          duration: 3000, // Duração de 3 segundos
        });
      }
    );
  }
  
  resetSuccessMessage(): void {
    setTimeout(() => {
      this.showSuccessMessage = false;
    }, 3000); // A mensagem de sucesso será ocultada após 3 segundos
  }

  cancelar(): void {
    this.notaFiscalForm.reset();
    this.itens.data = [];
    this.notaFiscalForm.patchValue({ valorTotalNota: 0 });
  }
   // Método para confirmar remoção do item
   confirmarRemoverItem(item: any): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { message: `Deseja excluir o item ${item.nomeProduto}?` }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.removerItem(item);
      }
    });
  }

  // Método para remover o item
  removerItem(item: any): void {
    const index = this.itens.data.findIndex(i => i.produto_id === item.produto_id);
    if (index !== -1) {
      const data = this.itens.data.slice();
      data.splice(index, 1);
      this.itens.data = data;
      this.calcularValorTotalNota(); // Atualizar o valor total
    }
  }
  editarItem(item: any): void {
    // Aqui você pode carregar os dados do item no formulário para edição
    this.notaFiscalForm.patchValue({
      produto: item.produto_id,
      quantidade: item.quantidade,
      valorUnitario: item.valorUnitario,
      valorTotalProduto: item.valorTotal,
      // Outros campos, se necessário
    });
  
    // Agora o item estará disponível no formulário para edição
    console.log('Editando item:', item);
  }
  
  abrirConsultaProduto(): void {
    this.router.navigate(['/consulta-nota-fiscal']); // Certifique-se de que o path esteja correto
  }
  abrirCadastroNotaFiscal(nota: any): void {
    this.router.navigate(['/cadastro-nota-fiscal'], { state: { notaFiscal: nota } });
  }


  
  
}
