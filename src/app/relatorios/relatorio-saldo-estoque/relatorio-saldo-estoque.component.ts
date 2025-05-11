import { Component, OnInit, ViewChild } from '@angular/core';
import { SaldoEstoqueService } from '../../../services/Saldo_Estoque.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-relatorio-saldo-estoque',
  templateUrl: './relatorio-saldo-estoque.component.html',
  styleUrls: ['./relatorio-saldo-estoque.component.css']
})
export class RelatorioSaldoEstoqueComponent implements OnInit {
  displayedColumns: string[] = ['produto_id', 'produto_nome', 'quantidade', 'valor_unitario', 'valor_total'];
  dataSource = new MatTableDataSource<any>([]);
  dataAtual: string;
  allData: any[] = []; // Armazena todos os dados para cálculo do total

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private saldoEstoqueService: SaldoEstoqueService) {
    this.dataAtual = new Date().toLocaleString();
  }

  ngOnInit(): void {
    this.saldoEstoqueService.getSaldoEstoque().subscribe(
      data => {
        this.allData = data;
        this.dataSource.data = data;
      },
      error => {
        console.error('Erro ao buscar saldo de estoque', error);
      }
    );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getTotal(): number {
    return this.allData.reduce((acc, curr) => acc + curr.valor_total, 0);
  }

  generatePDF(): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const title = 'Saldo de Estoque - CCLIMP';
    const subtitle = 'CCB - Parque São Jorge, R. Antônio Paiva Catalão, Nº 548.';
    const dateTime = new Date().toLocaleString();
    
    doc.setFontSize(14);
    const textWidth = doc.getTextWidth(title);
    doc.text(title, (pageWidth - textWidth) / 2, 10);

    doc.setFontSize(10);
    const subtitleWidth = doc.getTextWidth(subtitle);
    doc.text(subtitle, (pageWidth - subtitleWidth) / 2, 16);

    doc.setFontSize(10);
    doc.text(dateTime, pageWidth - doc.getTextWidth(dateTime) - 10, 10);

    autoTable(doc, {
      startY: 22,
      head: [['Codigo', 'Nome do Produto', 'Quantidade', 'Valor Unitário', 'Valor Total']],
      body: this.allData.map(item => [
        item.produto_id,
        item.produto_nome,
        item.quantidade,
        `R$ ${item.valor_unitario.toFixed(2)}`,
        `R$ ${item.valor_total.toFixed(2)}`
      ])
    });

    const valorTotal = this.getTotal().toFixed(2);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(
      `Total: R$ ${valorTotal}`,
      pageWidth - doc.getTextWidth(`Total: R$ ${valorTotal}`) - 10,
      (doc as any).lastAutoTable.finalY + 10
    );

    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    const x = window.open(url, '_blank');
    if (!x) {
      alert('Habilite pop-ups para visualizar o relatório.');
    }
  }
}