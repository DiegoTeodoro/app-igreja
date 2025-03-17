import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PedidoService } from '../../../services/pedido.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-relatorio-pedidos',
  templateUrl: './relatorio-pedidos.component.html',
  styleUrls: ['./relatorio-pedidos.component.css']
})
export class RelatorioPedidosComponent implements OnInit {

  igrejas: any[] = [];
  pedidos: any[] = [];
  pedidosFiltrados: any[] = [];
  dataSource = new MatTableDataSource<any>(this.pedidosFiltrados);

  filtroIgreja: string | null = null;
  dataInicio: Date | null = null;
  dataFim: Date | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private pedidoService: PedidoService) {}

  ngOnInit(): void {
    this.carregarIgrejas();
    this.carregarPedidos();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource._updateChangeSubscription(); // Força atualização dos dados
  }
  
  carregarIgrejas() {
    this.pedidoService.getIgrejas().subscribe(
      (dados: any[]) => {
        this.igrejas = dados;
        console.log('Igrejas carregadas:', this.igrejas); // Verifique os dados
      },
      error => {
        console.error('Erro ao carregar igrejas:', error);
      }
    );
  }
  
  carregarPedidos() {
    this.pedidoService.getPedidos().subscribe(
      (dados: any[]) => {
        this.pedidos = dados.sort((a, b) => new Date(b.data_pedido).getTime() - new Date(a.data_pedido).getTime()); // ordenação inicial
        this.pedidosFiltrados = [...this.pedidos];
        this.dataSource.data = this.pedidosFiltrados;
      },
      error => {
        console.error('Erro ao carregar pedidos:', error);
      }
    );
  }
  

  aplicarFiltros() {
    this.pedidosFiltrados = this.pedidos.filter(pedido => {
      const filtroIgrejaValido = !this.filtroIgreja || pedido.igreja_nome === this.filtroIgreja;
      const filtroDataInicioValido = !this.dataInicio || new Date(pedido.data_pedido).getTime() >= this.dataInicio.getTime();
      const filtroDataFimValido = !this.dataFim || new Date(pedido.data_pedido).getTime() <= this.dataFim.getTime();
  
      return filtroIgrejaValido && filtroDataInicioValido && filtroDataFimValido;
    })
    .sort((a, b) => new Date(b.data_pedido).getTime() - new Date(a.data_pedido).getTime()); // ordenação pela data mais recente
  
    this.dataSource.data = this.pedidosFiltrados;
  }
  

  limparFiltros() {
    this.filtroIgreja = null;
    this.dataInicio = null;
    this.dataFim = null;
    this.pedidosFiltrados = this.pedidos; // Redefine para exibir todos os pedidos
    this.dataSource.data = this.pedidosFiltrados; // Atualiza a fonte de dados
  }

  gerarRelatorioPDF() {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const title = 'Relatório de Pedidos - CNS';
    const subtitle = 'CCB - Parque São Jorge, R. Antônio Paiva Catalão, Nº 548.';
    const dateTime = new Date().toLocaleString();

    // Centraliza o título no cabeçalho
    doc.setFontSize(14);
    const textWidth = doc.getTextWidth(title);
    doc.text(title, (pageWidth - textWidth) / 2, 10); // Centraliza horizontalmente na página

    // Adiciona o subtítulo abaixo do título
    doc.setFontSize(10); // Fonte menor para o subtítulo
    const subtitleWidth = doc.getTextWidth(subtitle);
    doc.text(subtitle, (pageWidth - subtitleWidth) / 2, 16); // Centraliza horizontalmente

    // Alinha a data e hora no canto direito
    doc.setFontSize(10);
    doc.text(dateTime, pageWidth - doc.getTextWidth(dateTime) - 10, 10); // Alinha à direita com margem de 10 unidades

    // Gerar tabela com os dados filtrados
    autoTable(doc, {
        startY: 22,
        head: [['Nome da Igreja', 'Data do Pedido', 'Valor Total']],
        body: this.pedidosFiltrados.map(pedido => [
            pedido.igreja_nome,
            new Date(pedido.data_pedido).toLocaleDateString(),
            `R$ ${pedido.valor_total ? pedido.valor_total.toFixed(2) : '0.00'}`
        ])
    });

    // Obtenha a posição Y após a última tabela
    const finalY = (doc as any).lastAutoTable.finalY;
    const valorTotal = this.calcularValorTotal().toFixed(2);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold'); // Definir a fonte para negrito
    doc.text(
        `Valor Total: R$ ${valorTotal}`,
        pageWidth - doc.getTextWidth(`Valor Total: R$ ${valorTotal}`) - 10,
        finalY + 10
    );

    // Criar blob e abrir nova janela com o PDF
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    const x = window.open(url, '_blank');
    if (!x) {
        alert('Habilite pop-ups para visualizar o relatório.');
    }
}

  
calcularValorTotal() {
  return this.pedidosFiltrados.reduce((total, pedido) => total + pedido.valor_total, 0);
}

}
