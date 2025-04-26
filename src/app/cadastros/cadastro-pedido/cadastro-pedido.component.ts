import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar"; // Importar o MatSnackBar para exibir mensagens
import { PedidoService } from "../../../services/pedido.service";
import { SaldoEstoqueService } from "../../../services/Saldo_Estoque.service";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { Router } from '@angular/router';

@Component({
  selector: "app-cadastro-pedido",
  templateUrl: "./cadastro-pedido.component.html",
  styleUrls: ["./cadastro-pedido.component.css"],
})
export class CadastroPedidoComponent implements OnInit {
codigoPedido: any;
produtoControl = new FormControl();
produtosFiltrados: Observable<any[]> | undefined;
  
  igrejas: any[] = [];
  produtos: any[] = [];
  pedido: any = { igreja_id: null, recebedor: '', pedido_itens: [] };
  valorUnitario: number | null = null;
  quantidade: number | null = null;
  dataSource = new MatTableDataSource<any>([]);
  valorTotalPedido: number = 0;
  produtoSelecionado: any;
  igrejaSelecionada: any;

  // Definir as colunas que serão exibidas na tabela
  displayedColumns: string[] = ['produto', 'quantidade', 'valorUnitario', 'valorTotal', 'acoes'];

  constructor(
    private pedidoService: PedidoService,
    private saldoEstoqueService: SaldoEstoqueService,
    private snackBar: MatSnackBar,
    private router: Router // Adicione o Router aqui
  ) {}

  ngOnInit(): void {
    this.carregarIgrejas();
    this.carregarProdutos();
    this.inicializarFiltro();
    this.pedido.status = 'Processando'; 
    this.pedido.data_pedido = new Date(); // Define a data atual
}

  editarItem(_t151: any) {
    throw new Error('Method not implemented.');
  }

  carregarIgrejas() {
    this.pedidoService.getIgrejas().subscribe(
      (dados: any[]) => {
        this.igrejas = dados;
      },
      error => {
        console.error("Erro ao carregar igrejas: ", error);
      }
    );
  }

  carregarProdutos() {
    this.pedidoService.getProdutos().subscribe(
      (dados: any[]) => {
        this.produtos = dados;
      },
      (error) => {
        console.error("Erro ao carregar produtos: ", error);
      }
    );
  }

  // Método para obter o valor unitário ao selecionar um produto
  selecionarProduto(event: any) {
    const produtoSelecionado = event.option.value;
    this.produtoSelecionado = produtoSelecionado.id;
  
    this.produtoControl.setValue(produtoSelecionado.nome);
  
    this.saldoEstoqueService.getPrecoUnitario(produtoSelecionado.id).subscribe(
      (response) => {
        if (response && response.valor_unitario != null) {
          this.valorUnitario = parseFloat(response.valor_unitario.toFixed(2));
        } else {
          this.valorUnitario = 0;
          this.snackBar.open('Preço não encontrado no saldo de estoque.', 'Fechar', { duration: 3000 });
        }
      },
      (error) => {
        console.error("Erro ao buscar o valor unitário:", error);
        this.snackBar.open('Erro ao buscar o valor unitário.', 'Fechar', { duration: 3000 });
      }
    );
  }    
  
  inicializarFiltro() {
    this.produtosFiltrados = this.produtoControl.valueChanges.pipe(
      startWith(""),
      map((value) => this.filtrarProdutos(value || ""))
    );
  }

  filtrarProdutos(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.produtos.filter((produto) => produto.nome.toLowerCase().includes(filterValue));
  }

  adicionarItem() {
    if (!this.produtoSelecionado || this.quantidade == null || this.valorUnitario == null) {
      this.snackBar.open('Preencha todos os campos do item antes de adicionar.', 'Fechar', { duration: 3000 });
      return;
    }

    const produtoNome = this.produtos.find(p => p.id === this.produtoSelecionado).nome;
    const valorTotalItem = this.quantidade * this.valorUnitario;

    const novoItem = {
      produto: produtoNome,
      quantidade: this.quantidade,
      valorUnitario: parseFloat(this.valorUnitario.toFixed(2)),
      valorTotal: parseFloat(valorTotalItem.toFixed(2))
    };

    this.dataSource.data = [...this.dataSource.data, novoItem];
    this.valorTotalPedido += valorTotalItem;

    this.produtoSelecionado = null;
    this.quantidade = 0;
    this.valorUnitario = 0;
  }

  removerItem(element: any) {
    const index = this.dataSource.data.indexOf(element);
    if (index >= 0) {
      this.dataSource.data.splice(index, 1);
      this.dataSource._updateChangeSubscription();
      this.valorTotalPedido -= element.valorTotal;
    }
  }

  finalizarPedido() {
    // Validação dos campos obrigatórios
    if (!this.pedido.igreja_id || !this.pedido.recebedor || !this.dataSource.data.length) {
      this.snackBar.open('Há campos que ainda não foram preenchidos.', 'Fechar', { duration: 3000 });
      return;
    }

    const pedido = {
      igreja_id: this.pedido.igreja_id,
      data_pedido: new Date(),
      status: 'Entregue',  // Define o status como 'Entregue' ao finalizar o pedido
      recebedor: this.pedido.recebedor,
      valor_total: this.valorTotalPedido,
      pedido_itens: this.dataSource.data.map(item => ({
        produto_id: this.produtos.find(p => p.nome === item.produto).id,
        quantidade: item.quantidade,
        valor_unitario: item.valorUnitario,
        valor_total: item.valorTotal
      }))
    };

    this.pedidoService.salvarPedido(pedido).subscribe(
      response => {
        this.gerarPdfPedido();
        this.mostrarMensagem('Pedido realizado com sucesso!');
        this.limparFormulario();

        // Recarrega a página atual após finalizar o pedido
      window.location.reload();
      },
      error => {
        this.snackBar.open('Erro ao salvar o pedido. Tente novamente.', 'Fechar', { duration: 3000 });
        console.error('Erro ao salvar o pedido:', error);
      }
    );
  }

  gerarPdfPedido() {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Cabeçalho centralizado
    doc.setFontSize(16);
    const title = 'Congregação - Parque São Jorge';
    const titleWidth = doc.getTextWidth(title);
    doc.text(title, (pageWidth - titleWidth) / 2, 20);

    doc.setFontSize(12);
    const address = 'Rua Antônio Paiva Catalão, Nº 548';
    const addressWidth = doc.getTextWidth(address);
    doc.text(address, (pageWidth - addressWidth) / 2, 30);

    const subTitle = 'CCLIMP - Uberlândia';
    const subTitleWidth = doc.getTextWidth(subTitle);
    doc.text(subTitle, (pageWidth - subTitleWidth) / 2, 40);

    // Recebedor
    doc.setFontSize(10);
    doc.text('Recebedor: ' + this.pedido.recebedor, 10, 60);

    // Tabela de Itens do Pedido
    const tableY = 70;
    autoTable(doc, {
      startY: tableY,
      head: [['Produto', 'Quantidade', 'Valor Unitário', 'Valor Total']],
      body: this.dataSource.data.map(item => [
        item.produto,
        item.quantidade.toString(),
        item.valorUnitario.toFixed(2),
        item.valorTotal.toFixed(2)
      ])
    });

    // Valor Total do Pedido alinhado à direita
    const finalY = (doc as any).lastAutoTable.finalY;
    doc.setFontSize(10);
    const valorTotalText = 'Valor Total: ' + this.valorTotalPedido.toFixed(2);
    const valorTotalWidth = doc.getTextWidth(valorTotalText);
    doc.text(valorTotalText, pageWidth - valorTotalWidth - 10, finalY + 10);

    // Gerar PDF na tela para visualização
    doc.output('dataurlnewwindow');
  }

  limparFormulario() {
    this.pedido.recebedor = '';
    this.produtoSelecionado = null;
    this.quantidade = 0;
    this.valorUnitario = 0;
    this.dataSource.data = [];
    this.valorTotalPedido = 0;
    this.produtoControl.setValue('');
  }

 // Função para mostrar mensagens de snackbar com configuração personalizada
mostrarMensagem(mensagem: string) {
  const config: MatSnackBarConfig = {
    duration: 3000,
    verticalPosition: 'top',  // Posição vertical para o topo
    horizontalPosition: 'center',  // Posição horizontal no centro
    panelClass: ['snackbar-custom'],  // Classe CSS personalizada
  };
  this.snackBar.open(mensagem, 'Fechar', config);
}

pesquisarPedido() {
  if (!this.codigoPedido) {
    this.snackBar.open('Por favor, insira um código de pedido.', 'Fechar', { duration: 3000 });
    return;
  }

  this.pedidoService.getPedidoById(this.codigoPedido).subscribe(
    (pedido) => {
      this.pedido = pedido; // Popula os dados do cabeçalho do pedido
      this.carregarItensPedido(pedido.id); // Carrega os itens do pedido
    },
    (error) => {
      console.error("Erro ao buscar pedido:", error);
      this.snackBar.open('Erro ao buscar o pedido. Verifique o código e tente novamente.', 'Fechar', { duration: 3000 });
    }
  );
}

carregarItensPedido(pedidoId: number) {
  this.pedidoService.getItensPedidoById(pedidoId).subscribe(
    (itens) => {
      if (Array.isArray(itens)) {
        this.dataSource.data = itens.map(item => ({
          produto: item.produto_nome, // Nome do produto vindo da resposta
          quantidade: item.quantidade,
          valorUnitario: item.valor_unitario,
          valorTotal: item.valor_total
        }));
        this.valorTotalPedido = itens.reduce((acc, item) => acc + item.valor_total, 0); // Calcula o valor total do pedido
      } else {
        console.error('Erro: itens não é um array.', itens);
        this.dataSource.data = [];
        this.valorTotalPedido = 0;
      }
    },
    (error) => {
      console.error("Erro ao buscar itens do pedido:", error);
    }
  );
}
}

  

