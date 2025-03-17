import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NotaFiscalService } from '../../../services/nota-fiscal.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-relatorio-nota-fiscal',
  templateUrl: './relatorio-nota-fiscal.component.html',
  styleUrls: ['./relatorio-nota-fiscal.component.css']
})
export class RelatorioNotaFiscalComponent implements OnInit {

  fornecedores: any[] = [];
  notasFiscais: any[] = [];
  notasFiltradas: any[] = [];
  dataSource = new MatTableDataSource<any>([]); // Inicializa como MatTableDataSource vazio

  dataInicio: Date | null = null;
  dataFim: Date | null = null;

  displayedColumns: string[] = ['numero_nota', 'serie', 'data_emissao', 'fornecedor', 'valor_total'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private notaFiscalService: NotaFiscalService) {}

  ngOnInit(): void {
    this.carregarNotasFiscais();
  }

  ngAfterViewInit() {
    // Atribui o paginator ao dataSource
    this.dataSource.paginator = this.paginator;
  }

  carregarNotasFiscais() {
    this.notaFiscalService.getNotasFiscais().subscribe(
      (dados: any[]) => {
        this.notasFiscais = (dados || []).sort((a, b) =>
          new Date(b.data_emissao).getTime() - new Date(a.data_emissao).getTime()
        );
        this.notasFiltradas = [...this.notasFiscais];
        this.dataSource.data = this.notasFiltradas;
        this.dataSource.paginator = this.paginator;
      },
      error => {
        console.error('Erro ao carregar notas fiscais:', error);
        this.notasFiscais = [];
        this.notasFiltradas = [];
        this.dataSource.data = [];
      }
    );
  }
  
  
  FiltrarCampos() {
    this.notasFiltradas = this.notasFiscais.filter(nota => {
      const dataInicioMatches = this.dataInicio ? new Date(nota.data_emissao) >= this.dataInicio : true;
      const dataFimMatches = this.dataFim ? new Date(nota.data_emissao) <= this.dataFim : true;
      return dataInicioMatches && dataFimMatches;
    })
    .sort((a, b) => new Date(b.data_emissao).getTime() - new Date(a.data_emissao).getTime());
  
    this.dataSource.data = this.notasFiltradas;
    this.dataSource.paginator = this.paginator;
  }
  
  

  limparFiltros() {
    this.dataInicio = null;
    this.dataFim = null;
    this.notasFiltradas = [...this.notasFiscais];
    this.dataSource.data = this.notasFiltradas;
    this.dataSource.paginator = this.paginator; // Atualiza o paginator sempre que os dados mudam
  }
  
  
  gerarRelatorioPDF() {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const title = 'Relatório de Notas Fiscais';
    const dateTime = new Date().toLocaleString();

    // Centraliza o título
    doc.setFontSize(14);
    const textWidth = doc.getTextWidth(title);
    doc.text(title, (pageWidth - textWidth) / 2, 10);

    // Alinha a data e hora no canto direito
    doc.setFontSize(10);
    doc.text(dateTime, pageWidth - doc.getTextWidth(dateTime) - 10, 10);

    // Gerar tabela
    autoTable(doc, {
      startY: 22,
      head: [['Número da Nota', 'Série', 'Data de Emissão', 'Fornecedor', 'Valor Total']],
      body: this.notasFiltradas.map(nota => [
        nota.numero_nota,
        nota.serie,
        new Date(nota.data_emissao).toLocaleDateString(),
        nota.nome_fantasia || 'N/A',
        `R$ ${nota.valor_total.toFixed(2)}`
      ])
    });
    

    const finalY = (doc as any).lastAutoTable.finalY;
    const valorTotal = this.calcularValorTotal().toFixed(2);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(
      `Valor Total: R$ ${valorTotal}`,
      pageWidth - doc.getTextWidth(`Valor Total: R$ ${valorTotal}`) - 10,
      finalY + 10
    );

    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    const x = window.open(url, '_blank');
    if (!x) {
      alert('Habilite pop-ups para visualizar o relatório.');
    }
  }

  calcularValorTotal() {
    return this.notasFiltradas.reduce((total, nota) => total + nota.valor_total, 0);
  }
}
