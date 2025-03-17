import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PedidoCompraService } from '../../../services/pedidocompras.services';
import { ProdutoService } from '../../../services/produto.service';
import { MatTableDataSource } from '@angular/material/table';
import { CdkTableDataSourceInput } from '@angular/cdk/table';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-pedido-compra',
  templateUrl: './pedido-compra.component.html',
  styleUrls: ['./pedido-compra.component.css']
})
export class PedidoCompraComponent implements OnInit {


  pedidoForm: FormGroup;
  produtos: any[] = [];
  filteredProdutos: any[] = [];
  displayedColumns: string[] = ['codigo', 'produto', 'quantidade', 'acoes'];

  itens = new MatTableDataSource<any>([]);
  dataSource: CdkTableDataSourceInput<any> | undefined;

  constructor(
    private fb: FormBuilder,
    private pedidoCompraService: PedidoCompraService,
    private produtoService: ProdutoService,
    private snackBar: MatSnackBar
  ) {
    const today = new Date(); // Obtém a data atual
    this.pedidoForm = this.fb.group({
      solicitante: ['', Validators.required],
      produto: ['', Validators.required], // Campo para o nome do produto
      quantidade: [null, [Validators.required, Validators.min(1)]],
      data: [today, Validators.required] // Define a data atual como valor inicial
    });
  }

  ngOnInit(): void {
    this.loadProdutos();
  }

  loadProdutos(): void {
    this.produtoService.getProdutos().subscribe(
      (data) => {
        this.produtos = data;
        this.filteredProdutos = data; // Inicializa a lista filtrada com todos os produtos
      },
      (error) => {
        console.error('Erro ao carregar produtos', error);
      }
    );
  }

  onProdutoInput(event: Event): void {
    const input = event.target as HTMLInputElement; // Garante que o alvo é um elemento de entrada
    const value = input?.value || ''; // Usa valor vazio como fallback
    this.filteredProdutos = this.produtos.filter(produto =>
      produto.nome.toLowerCase().includes(value.toLowerCase())
    );
  }
  

  adicionarItem(): void {
    if (this.pedidoForm.valid) {
      // Busca o produto pelo nome selecionado no formulário
      const produtoSelecionado = this.produtos.find(
        produto => produto.nome === this.pedidoForm.value.produto
      );
  
      if (!produtoSelecionado) {
        this.snackBar.open('Produto não encontrado. Por favor, selecione um da lista.', 'Fechar', {
          duration: 3000
        });
        return;
      }
  
      const item = {
        id: produtoSelecionado.id, // Use o ID do produto
        produto: produtoSelecionado.nome, // Nome do produto
        quantidade: this.pedidoForm.value.quantidade // Quantidade informada
      };
  
      // Atualiza a tabela
      this.itens.data = [...this.itens.data, item];
  
      // Apenas reseta os campos de produto e quantidade
      this.pedidoForm.patchValue({
        produto: '',
        quantidade: null
      });
    } else {
      this.snackBar.open('Por favor, preencha os campos obrigatórios.', 'Fechar', {
        duration: 3000
      });
    }
  }
  
  salvarPedidoCompra(): void {
    const pedidoCompra = {
      solicitante: this.pedidoForm.value.solicitante,
      data_pedido: new Date(this.pedidoForm.value.data).toISOString().split('T')[0], // Converte para 'YYYY-MM-DD'
      itens: this.itens.data.map((item) => ({
        produto_id: item.id,
        quantidade: item.quantidade
      }))
    };
  
    this.pedidoCompraService.salvarPedido(pedidoCompra).subscribe(
      () => {
        this.snackBar.open('Pedido salvo com sucesso!', 'Fechar', { duration: 3000 });
  
        // Gera o relatório em PDF após o salvamento bem-sucedido
        this.gerarRelatorioPDF();
  
        // Recarrega a tela após um pequeno atraso para garantir que o PDF seja gerado
        setTimeout(() => {
          window.location.reload();
        }, 500); // 500ms de atraso para evitar conflitos com o gerador de PDF
      },
      (error) => {
        console.error('Erro ao salvar pedido:', error);
        this.snackBar.open('Erro ao salvar pedido.', 'Fechar', { duration: 3000 });
      }
    );
  }
  
  deletarItem(_t114: any) {
    throw new Error('Method not implemented.');
    }

    removerItem(index: number): void {
      const itensAtualizados = this.itens.data.slice();
      itensAtualizados.splice(index, 1);
      this.itens.data = itensAtualizados;
    }
    
  gerarRelatorioPDF(): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const titulo = 'Solicitação de Pedidos - CNS';
    const subtitulo = 'CCB - Parque São Jorge, R. Antônio Paiva Catalão, Nº 548.';
    const dataAtual = new Date().toLocaleDateString();
  
    // Título centralizado
    doc.setFontSize(14);
    const tituloWidth = doc.getTextWidth(titulo);
    doc.text(titulo, (pageWidth - tituloWidth) / 2, 10);
  
    // Subtítulo centralizado
    doc.setFontSize(10);
    const subtituloWidth = doc.getTextWidth(subtitulo);
    doc.text(subtitulo, (pageWidth - subtituloWidth) / 2, 16);
  
    // Adicionar Solicitante e Data na mesma linha
    doc.setFontSize(12);
    const solicitanteText = `Solicitante: ${this.pedidoForm.value.solicitante}`;
    const dataText = `Data: ${dataAtual}`;
    const startX = 10; // Margem esquerda
    const dataX = pageWidth - doc.getTextWidth(dataText) - 10; // Margem direita para o texto de Data
    doc.text(solicitanteText, startX, 30); // Alinha o solicitante à esquerda
    doc.text(dataText, dataX, 30); // Alinha a data à direita na mesma linha
  
    // Gerar tabela com os itens
    const itensTabela = this.itens.data.map((item: any) => [
      item.id, // Código
      item.produto, // Nome do produto
      item.quantidade // Quantidade
    ]);
  
    // Gerar tabela no PDF
    autoTable(doc, {
      startY: 40,
      head: [['Código', 'Produto', 'Quantidade']],
      body: itensTabela,
    });
  
    // Criar blob e abrir nova janela com o PDF
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    const x = window.open(url, '_blank');
    if (!x) {
      alert('Habilite pop-ups para visualizar o relatório.');
    }
  }

  cancelarPedido(): void {
    // Limpa os campos solicitante, produto e quantidade mantendo a data
    this.pedidoForm.patchValue({
      solicitante: '',
      produto: '',
      quantidade: null
    });
  
    // Limpa os itens da tabela
    this.itens.data = [];
  
    // Exibe uma mensagem opcional ao usuário indicando que o formulário foi limpo
    this.snackBar.open('Cadastro cancelado e campos limpos.', 'Fechar', {
      duration: 3000
    });
  }
  
  
}
