import { Component, OnInit } from '@angular/core';
import { SaldoEstoqueService } from '../Saldo_Estoque.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-relatorio-saldo-estoque',
  templateUrl: './relatorio-saldo-estoque.component.html',
  styleUrls: ['./relatorio-saldo-estoque.component.css']
})
export class RelatorioSaldoEstoqueComponent implements OnInit {
  displayedColumns: string[] = ['produto_id', 'produto_nome', 'quantidade', 'valor_unitario', 'valor_total'];
  dataSource: any[] = [];
  dataAtual: string;

  constructor(private saldoEstoqueService: SaldoEstoqueService) {
    this.dataAtual = new Date().toLocaleString();
  }

  ngOnInit(): void {
    this.saldoEstoqueService.getSaldoEstoque().subscribe(
      data => {
        this.dataSource = data;
      },
      error => {
        console.error('Erro ao buscar saldo de estoque', error);
      }
    );
  }

  getTotal(): number {
    return this.dataSource.reduce((acc, curr) => acc + curr.valor_total, 0);
  }

  generatePDF(): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const title = 'Saldo de Estoque - CCLIMP';
    const dateTime = new Date().toLocaleString();

    // Centraliza o título no cabeçalho
    doc.setFontSize(14);
    const textWidth = doc.getTextWidth(title);
    doc.text(title, (pageWidth - textWidth) / 2, 10); // Centraliza horizontalmente na página

    // Alinha a data e hora no canto direito
    doc.setFontSize(10);
    doc.text(dateTime, pageWidth - doc.getTextWidth(dateTime) - 10, 10); // Alinha à direita com margem de 10 unidades

    // Gerar tabela com os dados
    autoTable(doc, {
      startY: 22,
      head: [['Codigo', 'Nome do Produto', 'Quantidade', 'Valor Unitário', 'Valor Total']],
      body: this.dataSource.map(item => [
        item.produto_id,
        item.produto_nome,
        item.quantidade,
        `R$ ${item.valor_unitario.toFixed(2)}`,
        `R$ ${item.valor_total.toFixed(2)}`
      ])
    });

    // Adicionar o valor total no final do relatório
    const valorTotal = this.getTotal().toFixed(2);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold'); // Definir a fonte para negrito
    doc.text(
      `Total: R$ ${valorTotal}`,
      pageWidth - doc.getTextWidth(`Total: R$ ${valorTotal}`) - 10,
      (doc as any).lastAutoTable.finalY + 10 // Utilize 'as any' para evitar erro de tipo
    );

    // Abra uma nova janela com visualização do PDF usando um blob
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    const x = window.open(url, '_blank');
    if (!x) {
      alert('Habilite pop-ups para visualizar o relatório.');
    }
  }
}
