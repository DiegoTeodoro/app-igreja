import { Component, OnInit, ViewChild } from '@angular/core';
import { InventarioService } from '../../../services/Inventario.Service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-relatorio-inventario',
  templateUrl: './relatorio-inventario.component.html',
  styleUrls: ['./relatorio-inventario.component.css']
})
export class RelatorioInventarioComponent implements OnInit {
  displayedColumns: string[] = ['produto', 'quantidade', 'data', 'usuario'];
  dataSource = new MatTableDataSource<any>([]);
  dataInicio: Date | null = null;
  dataFim: any = null;
  pedidosFiltrados: any[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private inventarioService: InventarioService) {}

  ngOnInit(): void {
    this.fetchRelatorio();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  fetchRelatorio(): void {
    this.inventarioService.getRelatorioInventario().subscribe({
      next: (data) => {
        const sortedData = data.sort((a, b) =>
          new Date(b.data_inventario).getTime() - new Date(a.data_inventario).getTime()
        );
        this.dataSource.data = sortedData;
        this.pedidosFiltrados = [...sortedData]; // Mantém uma cópia dos dados originais para filtros
      }
    });
  }

  filtrarCampos(): void {
    if (!this.dataInicio && !this.dataFim) {
      this.dataSource.data = this.pedidosFiltrados;
      return;
    }

    this.dataSource.data = this.pedidosFiltrados.filter(item => {
      const itemDate = new Date(item.data_inventario).getTime();
      const inicioValido = !this.dataInicio || itemDate >= new Date(this.dataInicio).getTime();
      const fimValido = !this.dataFim || itemDate <= new Date(this.dataFim).getTime();
      return inicioValido && fimValido;
    });
  }

  limparFiltros(): void {
    this.dataInicio = null;
    this.dataFim = null;
    this.dataSource.data = [...this.pedidosFiltrados];
  }

  gerarRelatorioPDF(): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const title = 'Relatório de Inventário - Estoque';
    const dateTime = new Date().toLocaleString();

    doc.setFontSize(14);
    doc.text('Relatório de Inventário', pageWidth / 2, 10, { align: 'center' });

    doc.setFontSize(10);
    doc.text(`Data de emissão: ${new Date().toLocaleString()}`, pageWidth - 10, 10, { align: 'right' });

    autoTable(doc, {
      startY: 20,
      head: [['Produto', 'Quantidade', 'Data', 'Usuário']],
      body: this.dataSource.filteredData.map(item => [
        item.produto_nome,
        item.quantidade,
        new Date(item.data_inventario).toLocaleDateString(),
        item.usuario || 'N/A'
      ])
    });

    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }
}