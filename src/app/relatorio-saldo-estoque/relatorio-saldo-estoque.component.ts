import { Component, OnInit } from '@angular/core';
import { SaldoEstoqueService } from '../Saldo_Estoque.service';
import { MatTableDataSource } from '@angular/material/table';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-relatorio-saldo-estoque',
  templateUrl: './relatorio-saldo-estoque.component.html',
  styleUrls: ['./relatorio-saldo-estoque.component.css']
})
export class RelatorioSaldoEstoqueComponent implements OnInit {
  displayedColumns: string[] = ['produto_id', 'produto_nome', 'quantidade', 'valor_unitario', 'valor_total'];
  dataSource = new MatTableDataSource<any>();
  dataAtual: string;

  constructor(private saldoEstoqueService: SaldoEstoqueService) {
    this.dataAtual = new Date().toLocaleString();
  }

  ngOnInit(): void {
    this.saldoEstoqueService.getSaldoEstoque().subscribe(
      data => {
        this.dataSource.data = data;
      },
      error => {
        console.error('Erro ao buscar saldo de estoque', error);
      }
    );
  }

  getTotal(): number {
    return this.dataSource.data.reduce((acc, curr) => acc + curr.valor_total, 0);
  }

  generatePDF(): void {
    const data = document.getElementById('relatorioCompleto');
    if (data) {
      html2canvas(data).then(canvas => {
        const imgWidth = 208;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const contentDataURL = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        pdf.addImage(contentDataURL, 'PNG', 0, 10, imgWidth, imgHeight);
  
        // Abra uma nova janela com visualização do PDF usando um blob
        const blob = pdf.output('blob');
        const url = URL.createObjectURL(blob);
        const x = window.open(url, '_blank');
        if (!x) {
          alert('Habilite pop-ups para visualizar o relatório.');
        }
      }).catch(error => {
        console.error('Erro ao gerar PDF:', error);
        alert('Ocorreu um erro ao gerar o PDF. Tente novamente.');
      });
    }
  }
  
}
