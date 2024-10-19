import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { NotaFiscalService } from '../nota-fiscal.service'; // Importando o serviço

@Component({
  selector: 'app-cadastro-nota-fiscal',
  templateUrl: './cadastro-nota-fiscal.component.html',
  styleUrls: ['./cadastro-nota-fiscal.component.css'],
})
export class CadastroNotaFiscalComponent implements OnInit {
  notaFiscalForm: FormGroup;
  itens = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['nomeProduto', 'quantidade', 'valorUnitario', 'valorTotal'];
  fornecedores: any[] = [];
  produtos: any[] = [];

  constructor(
    private fb: FormBuilder,
    private notaFiscalService: NotaFiscalService // Injete o serviço
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
  
    // Verifica se os valores não são nulos ou indefinidos
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
  
    // Adicionar o item ao array de itens
    this.itens.data = [...this.itens.data, item];
  
    // Limpar campos após adicionar o item
    this.notaFiscalForm.patchValue({
      produto: '',
      quantidade: '',
      valorUnitario: '',
      valorTotalProduto: ''
    });
  
    // Recalcular o valor total da nota fiscal
    this.calcularValorTotalNota();
  }
  

  calcularValorTotalNota(): void {
    const desconto = this.notaFiscalForm.value.desconto || 0;
    const outros = this.notaFiscalForm.value.outros || 0;
    const valorItens = this.itens.data.reduce((total, item) => total + item.valorTotal, 0);

    const valorTotalNota = valorItens - desconto + outros;
    this.notaFiscalForm.patchValue({ valorTotalNota: valorTotalNota });
  }

 // Função para formatar a data no formato 'YYYY-MM-DD'
formatarData(data: Date): string {
  const d = new Date(data);
  const ano = d.getFullYear();
  const mes = ('0' + (d.getMonth() + 1)).slice(-2); // Adiciona o 0 à esquerda se necessário
  const dia = ('0' + d.getDate()).slice(-2); // Adiciona o 0 à esquerda se necessário
  return `${ano}-${mes}-${dia}`;
}

salvarNotaFiscal(): void {
  const dataEmissao = this.formatarData(this.notaFiscalForm.value.dataEmissao);

  if (!dataEmissao) {
    console.error('Data de emissão inválida.');
    return; // Impede o salvamento se a data for inválida
  }

  const notaFiscal = {
    numero_nota: this.notaFiscalForm.value.numeroNota,
    serie: this.notaFiscalForm.value.serie,
    chave_acesso: this.notaFiscalForm.value.chaveAcesso,
    fornecedor_id: this.notaFiscalForm.value.fornecedor,
    data_emissao: dataEmissao, // Use a data formatada
    valor_total: this.notaFiscalForm.value.valorTotalNota,
    observacoes: this.notaFiscalForm.value.observacao,
    itensNotaFiscal: this.itens.data // Itens da nota fiscal
  };

  this.notaFiscalService.salvarNotaFiscal(notaFiscal).subscribe(
    (response: any) => {
      console.log('Nota Fiscal salva com sucesso!', response);

      // Recarregar a página após o salvamento
      window.location.reload(); // Força a recarga da página
    },
    (error: any) => {
      console.error('Erro ao salvar nota fiscal:', error);
    }
  );
}

}
