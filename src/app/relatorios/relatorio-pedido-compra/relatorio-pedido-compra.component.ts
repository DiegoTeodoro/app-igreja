import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PedidoCompraService } from '../../../services/pedidocompras.services';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-relatorio-pedido-compra',
  templateUrl: './relatorio-pedido-compra.component.html',
  styleUrls: ['./relatorio-pedido-compra.component.css'],
})
export class RelatorioPedidoCompraComponent implements OnInit {
  dataInicio: Date | null = null;
  dataFim: Date | null = null;

  displayedColumns: string[] = ['codigo', 'produto', 'quantidade', 'dataPedido'];
  dataSource = new MatTableDataSource<any>([]);
  notasFiscais: any[] = [];
  notasFiltradas: any[] = [];
  pedidosAgrupados: any[] = [];

  constructor(private pedidoCompraService: PedidoCompraService) {}

  ngOnInit(): void {
    this.atualizarRelatorio();
  }

  atualizarRelatorio(): void {
    const dataInicio = this.dataInicio ? this.dataInicio : new Date(0); // Data mínima possível
    const dataFim = this.dataFim ? this.dataFim : new Date(); // Data atual

    this.pedidoCompraService.getRelatorioPedidos(dataInicio, dataFim).subscribe(
      (data) => {
        this.notasFiscais = data;
        this.notasFiltradas = [...this.notasFiscais];
        this.dataSource.data = this.notasFiltradas;
        this.agruparPedidosPorData();
      },
      (error) => {
        console.error('Erro ao carregar pedidos:', error);
      }
    );
  }

  agruparPedidosPorData(): void {
    const grupos = this.notasFiltradas.reduce((acc, pedido) => {
      const dataPedido = typeof pedido.dataPedido === 'string' ? new Date(pedido.dataPedido) : pedido.dataPedido;
  
      if (dataPedido instanceof Date && !isNaN(dataPedido.getTime())) {
        const data = dataPedido.toISOString().split('T')[0];
        if (!acc[data]) {
          acc[data] = [];
        }
        acc[data].push(pedido);
      }
  
      return acc;
    }, {});
  
    // Conversão para array e ordenação por data decrescente (mais recente primeiro)
    this.pedidosAgrupados = Object.keys(grupos)
      .map((data) => ({
        data: new Date(data),
        pedidos: grupos[data],
      }))
      .sort((a, b) => b.data.getTime() - a.data.getTime()); // ordena por data decrescente
  }
  

  filtrarRelatorio(): void {
    this.filtrarCampos();
  }

  filtrarCampos(): void {
    if (this.dataInicio && this.dataFim) {
      this.pedidoCompraService.getRelatorioPedidos(this.dataInicio, this.dataFim).subscribe(
        (data) => {
          this.notasFiscais = data;
          this.notasFiltradas = [...this.notasFiscais];
          this.dataSource.data = this.notasFiltradas;
          this.agruparPedidosPorData();
        },
        (error) => {
          console.error('Erro ao filtrar pedidos:', error);
        }
      );
    } else {
      this.limparFiltros();
    }
  }

  limparFiltros(): void {
    this.dataInicio = null;
    this.dataFim = null;
    this.atualizarRelatorio();
  }

  gerarRelatorioPDF(): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const title = 'Relatório de Solicitação de Compras - CNS';
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

    // Gerar tabela para cada grupo de pedidos
    this.pedidosAgrupados.forEach((grupo) => {
      autoTable(doc, {
        startY: doc.lastAutoTable ? (doc as any).lastAutoTable.finalY + 10 : 22,
        head: [['Código', 'Produto', 'Quantidade', 'Data da solicitação']],
        body: grupo.pedidos.map((nota: { codigo: any; produto: any; quantidade: any; dataPedido: string | number | Date; }) => [
          nota.codigo,
          nota.produto,
          nota.quantidade,
          new Date(nota.dataPedido).toLocaleDateString(),
        ]),
      });
    });

    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    const x = window.open(url, '_blank');
    if (!x) {
      alert('Habilite pop-ups para visualizar o relatório.');
    }
  }
}
