import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PedidoService } from '../pedido.service'; // Certifique-se de que o caminho está correto
import { SaldoEstoqueService } from '../Saldo_Estoque.service';

export interface PedidoItem {
  produto_nome: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
}

@Component({
  selector: 'app-cadastro-pedido',
  templateUrl: './cadastro-pedido.component.html',
  styleUrls: ['./cadastro-pedido.component.css']
})
export class CadastroPedidoComponent implements OnInit {

  dataSource: PedidoItem[] = [];

  displayedColumns: string[] = ['produto', 'quantidade', 'valor_unitario', 'valor_total', 'acoes'];

  // Propriedades do pedido
  pedido: any = {};
  produtos: any[] = [];
  igrejas: any[] = [];

  // Injeção do SaldoEstoqueService e PedidoService no construtor
  constructor(private snackBar: MatSnackBar, private pedidoService: PedidoService, private saldoEstoqueService: SaldoEstoqueService) {}

  ngOnInit() {
    this.carregarIgrejas();
    this.carregarProdutos();
    
    // Define a data atual para o campo data_pedido
    this.pedido.data_pedido = new Date();
  }
  
  carregarIgrejas() {
    this.pedidoService.getIgrejas().subscribe((data: any[]) => {
      this.igrejas = data;
    }, (error: any) => {
      console.error('Erro ao carregar igrejas:', error);
    });
  }
  
  carregarProdutos() {
    this.pedidoService.getProdutos().subscribe((data: any[]) => {
      this.produtos = data;
    }, (error: any) => {
      console.error('Erro ao carregar produtos:', error);
    });
  }

  // Função para finalizar o pedido
  finalizarPedido() {
    this.snackBar.open('Pedido finalizado com sucesso!', 'Fechar', {
      duration: 3000, // Duração da mensagem (3 segundos)
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });

    // Limpar os campos do formulário
    this.limparCampos();
  }

  // Função para limpar os campos do formulário
  limparCampos() {
    this.pedido = {}; // Reseta o objeto pedido
    this.dataSource = []; // Limpa os itens adicionados ao pedido
  }

  // Função chamada quando um produto é selecionado
  atualizarValorUnitario(event: any) {
    const produtoId = event.value;
    this.saldoEstoqueService.getPrecoUnitario(produtoId).subscribe((response: any) => {
      this.pedido.valor_unitario = response.preco_unitario;
      this.calcularValorTotal();  // Atualiza o valor total quando o valor unitário muda
    }, (error: any) => {
      console.error('Erro ao buscar valor unitário:', error);
    });
  }

  // Função para calcular o valor total
  calcularValorTotal() {
    if (this.pedido.quantidade && this.pedido.valor_unitario) {
      this.pedido.valor_total = this.pedido.quantidade * this.pedido.valor_unitario;
    }
  }

  onEdit(item: PedidoItem) {
    // Implementação para editar um item
  }

  onDelete(item: PedidoItem) {
    // Implementação para deletar um item
  }

  adicionarItem() {
    if (this.pedido.produto_id && this.pedido.quantidade && this.pedido.valor_unitario) {
      // Encontra o nome do produto selecionado
      const produtoNome = this.produtos.find(p => p.id === this.pedido.produto_id)?.nome || 'Produto desconhecido';
  
      // Cria um novo item baseado nos campos preenchidos
      const newItem: PedidoItem = {
        produto_nome: produtoNome,
        quantidade: this.pedido.quantidade,
        valor_unitario: this.pedido.valor_unitario,
        valor_total: this.pedido.valor_total
      };
  
      // Adiciona o novo item à dataSource
      this.dataSource = [...this.dataSource, newItem];
  
      // Atualiza o valor total do pedido
      this.atualizarValorTotalPedido();
  
      // Limpa os campos após adicionar
      this.limparCamposItem();
    } else {
      this.snackBar.open('Preencha todos os campos do item antes de adicionar.', 'Fechar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    }
  }
  

  // Função para recalcular o valor total do pedido baseado nos itens da tabela
atualizarValorTotalPedido() {
  this.pedido.valor_total = this.dataSource.reduce((total, item) => total + item.valor_total, 0);
}

  
  
  // Função para limpar os campos do item do pedido (mas não o cabeçalho)
limparCamposItem() {
  this.pedido.produto_id = null;
  this.pedido.quantidade = null;
  this.pedido.valor_unitario = null;
 
}
}
