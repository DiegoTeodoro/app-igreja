import { Component, OnInit } from '@angular/core';
import { PedidoService } from '../pedido.service';
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
      console.log('Dados recebidos:', dados);
  
      // Agrupar pedidos pelo pedido_id
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
  
      // Converter o agrupamento em um array
      this.pedidos = Object.values(pedidosAgrupados);
      this.pedidosFiltrados = this.pedidos;
    });
  }
  
  

  aplicarFiltros(): void {
    this.pedidosFiltrados = this.pedidos.filter((pedido) => {
      const filtroIgrejaValido = !this.filtroIgreja || pedido.igreja_id === this.filtroIgreja;
      const filtroDataInicioValido = !this.dataInicio || new Date(pedido.data_pedido) >= this.dataInicio;
      const filtroDataFimValido = !this.dataFim || new Date(pedido.data_pedido) <= this.dataFim;
      return filtroIgrejaValido && filtroDataInicioValido && filtroDataFimValido;
    });
  }

  limparFiltros(): void {
    this.filtroIgreja = null;
    this.dataInicio = null;
    this.dataFim = null;
    this.pedidosFiltrados = this.pedidos;
  }

  gerarRelatorioPDF(): void {
    const doc = new jsPDF();
    let yPosition = 10; // Posição inicial para o conteúdo

    this.pedidosFiltrados.forEach((pedido) => {
      doc.text(`${pedido.igreja_nome} - ${new Date(pedido.data_pedido).toLocaleDateString()}`, 10, yPosition);
      
      autoTable(doc, {
        startY: yPosition + 10,
        head: [['Produto', 'Quantidade', 'Valor Unitário', 'Valor Total']],
        body: pedido.itens.map((item: any) => [
          item.produto_nome,
          item.quantidade,
          item.valor_unitario.toFixed(2),
          item.valor_total.toFixed(2)
        ])
      });

      // Atualize yPosition após a tabela
      yPosition = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : yPosition + 30;

      doc.text(`Valor Total do Pedido: R$ ${pedido.valor_total.toFixed(2)}`, 10, yPosition);
      yPosition += 20; // Espaço entre pedidos
    });

    doc.save('relatorio-detalhado-pedidos.pdf');
  }
}
