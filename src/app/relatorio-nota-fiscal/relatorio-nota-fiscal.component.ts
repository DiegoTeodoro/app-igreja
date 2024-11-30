import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NotaFiscalService } from '../nota-fiscal.service';
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

  filtroFornecedor: number | null = null;
  dataInicio: Date | null = null;
  dataFim: Date | null = null;

  displayedColumns: string[] = ['numero_nota', 'serie', 'data_emissao', 'fornecedor', 'valor_total'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private notaFiscalService: NotaFiscalService) {}

  ngOnInit(): void {
    this.carregarFornecedores();
    this.carregarNotasFiscais();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator; // Associa o paginator
  }

  carregarFornecedores() {
    this.notaFiscalService.getFornecedores().subscribe(
      (dados: any[]) => {
        this.fornecedores = dados;
      },
      error => {
        console.error('Erro ao carregar fornecedores:', error);
      }
    );
  }

  carregarNotasFiscais() {
    this.notaFiscalService.getNotasFiscais().subscribe(
      (dados: any[]) => {
        console.log('Dados recebidos:', dados); // Verificar o conteúdo dos dados
        this.notasFiscais = dados || [];
        this.notasFiltradas = [...this.notasFiscais];
        this.dataSource.data = this.notasFiltradas;
      },
      error => {
        console.error('Erro ao carregar notas fiscais:', error);
        this.notasFiscais = [];
        this.notasFiltradas = [];
        this.dataSource.data = [];
      }
    );
  }
  

  aplicarFiltros() {
    this.notasFiltradas = this.notasFiscais.filter(nota => {
      const filtroFornecedorValido = !this.filtroFornecedor || nota.fornecedor_id === this.filtroFornecedor;
      const filtroDataInicioValido = !this.dataInicio || new Date(nota.data_emissao) >= this.dataInicio;
      const filtroDataFimValido = !this.dataFim || new Date(nota.data_emissao) <= this.dataFim;
      return filtroFornecedorValido && filtroDataInicioValido && filtroDataFimValido;
    });
    this.dataSource.data = this.notasFiltradas; // Atualiza o dataSource com os dados filtrados
  }

  limparFiltros() {
    this.filtroFornecedor = null;
    this.dataInicio = null;
    this.dataFim = null;
    this.notasFiltradas = [...this.notasFiscais]; // Reseta para os dados originais
    this.dataSource.data = this.notasFiltradas;
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
    doc.setFontSize(12);
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
