import { Component, OnInit } from '@angular/core';
import { PedidoService } from '../../../services/pedido.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-relatorio-detalhado-pedidos',
  templateUrl: './relatorio-detalhado-pedidos.component.html',
  styleUrls: ['./relatorio-detalhado-pedidos.component.css']
})
export class RelatorioDetalhadoPedidosComponent implements OnInit {
  igrejas: any[] = [];
  pedidos: any[] = [];
  pedidosFiltrados: any[] = [];

  filtroIgreja: string | null = null;
  dataInicio: Date | null = null;
  dataFim: Date | null = null;

  constructor(private pedidoService: PedidoService) {}

  ngOnInit(): void {
    this.carregarIgrejas();
    this.carregarPedidos();
  }

  carregarIgrejas(): void {
    this.pedidoService.getIgrejas().subscribe((dados) => (this.igrejas = dados));
  }

  carregarPedidos(): void {
    this.pedidoService.getPedidosDetalhados().subscribe((dados) => {
      const pedidosAgrupados: any = {};
      dados.forEach((pedido: any) => {
        if (!pedidosAgrupados[pedido.pedido_id]) {
          pedidosAgrupados[pedido.pedido_id] = {
            pedido_id: pedido.pedido_id,
            data_pedido: pedido.data_pedido,
            valor_total: pedido.valor_total,
            igreja_nome: pedido.igreja_nome,
            itens: [],
          };
        }
        pedidosAgrupados[pedido.pedido_id].itens.push({
          produto_nome: pedido.produto_nome,
          quantidade: pedido.quantidade,
          valor_unitario: pedido.valor_unitario,
          valor_total: pedido.valor_total,
        });
      });
  
      // Ordenar pedidos por data mais recente primeiro
      this.pedidos = Object.values(pedidosAgrupados).sort((a: any, b: any) =>
        new Date(b.data_pedido).getTime() - new Date(a.data_pedido).getTime()
      );
  
      this.pedidosFiltrados = [...this.pedidos];
    });
  }
  
  

  aplicarFiltros(): void {
    this.pedidosFiltrados = this.pedidos.filter((pedido) => {
      const filtroIgrejaValido = !this.filtroIgreja || pedido.igreja_nome === this.filtroIgreja;
      const filtroDataInicioValido = !this.dataInicio || new Date(pedido.data_pedido) >= this.dataInicio;
      const filtroDataFimValido = !this.dataFim || new Date(pedido.data_pedido) <= this.dataFim;
      return filtroIgrejaValido && filtroDataInicioValido && filtroDataFimValido;
    })
    .sort((a, b) => new Date(b.data_pedido).getTime() - new Date(a.data_pedido).getTime());
  }
  

  limparFiltros(): void {
    this.filtroIgreja = null;
    this.dataInicio = null;
    this.dataFim = null;
    this.pedidosFiltrados = this.pedidos;
  }

  gerarRelatorioPDF(): void {
    const doc = new jsPDF();
  
    // Adicionar cabeçalho ao PDF
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Relatorio detalhado de pedidos - CNS', 105, 10, { align: 'center' });
  
    let yPosition = 20; // Posição inicial para o conteúdo abaixo do cabeçalho
  
    this.pedidosFiltrados.forEach((pedido) => {
      // Nome da igreja com fonte menor
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`${pedido.igreja_nome} - ${new Date(pedido.data_pedido).toLocaleDateString()}`, 10, yPosition);
  
      // Adicionar tabela de itens
      autoTable(doc, {
        startY: yPosition + 5,
        head: [['Produto', 'Quantidade', 'Valor Unitário', 'Valor Total']],
        body: pedido.itens.map((item: any) => [
          item.produto_nome,
          item.quantidade,
          item.valor_unitario.toFixed(2),
          item.valor_total.toFixed(2),
        ]),
        headStyles: { fillColor: [41, 128, 185] }, // Cor do cabeçalho da tabela
      });
  
      // Atualizar posição após a tabela, verificando se `doc.lastAutoTable` está definido
      if (doc.lastAutoTable?.finalY) {
        yPosition = doc.lastAutoTable.finalY + 5;
      }
  
      // Valor total do pedido do lado direito com fonte menor
      doc.setFontSize(10);
      doc.text(
        `Valor Total do Pedido: R$ ${pedido.valor_total.toFixed(2)}`,
        200,
        yPosition,
        { align: 'right' }
      );
  
      yPosition += 10; // Espaço entre os pedidos
    });
  
    // Criar blob e abrir nova janela com o PDF
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    const x = window.open(url, '_blank');
    if (!x) {
      alert('Habilite pop-ups para visualizar o relatório.');
    }
  }
  
  
}
