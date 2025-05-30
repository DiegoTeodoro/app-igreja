import { Component, OnInit } from '@angular/core';
import { ProdutoService } from '../../../services/produto.service';
import { Produto } from '../../models/produto';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; // Importar desta forma
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ViewChild, AfterViewInit } from '@angular/core';


@Component({
  selector: 'app-relatorio-produto',
  templateUrl: './relatorio-produto.component.html',
  styleUrls: ['./relatorio-produto.component.css']
})
export class RelatorioProdutoComponent implements OnInit {
  produtos: Produto[] = [];
  displayedColumns: string[] = ['nome', 'volume', 'codigoBarras', 'fornecedor', 'marca'];
  dataAtual: any;
  produtosFiltrados: any[] = [];
  dataSource = new MatTableDataSource<Produto>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private produtoService: ProdutoService) {}

  ngOnInit() {
    this.produtoService.getProdutos().subscribe(
      (data) => {
        this.produtos = data;
        this.dataSource = new MatTableDataSource<Produto>(this.produtos);
        this.dataSource.paginator = this.paginator;
      },
      (error) => {
        console.error('Erro ao buscar produtos', error);
      }
    );
    this.atualizarDataHora();
    setInterval(() => this.atualizarDataHora(), 60000); // Atualiza a cada 60 segundos
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  atualizarDataHora() {
    const agora = new Date();
    const opcoes = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    this.dataAtual = agora.toLocaleString('pt-BR');

  }

  gerarPDF() {
    const doc = new jsPDF({ orientation: 'landscape' });
    const pageWidth = doc.internal.pageSize.getWidth();
  
    const title = 'Relatório de Cadastro de Produtos - CNS';
    const subtitle = 'CCB - Parque São Jorge, R. Antônio Paiva Catalão, Nº 548.';
    const dateTime = new Date().toLocaleString();
  
    // Centraliza o título no cabeçalho
    doc.setFontSize(14);
    const textWidth = doc.getTextWidth(title);
    doc.text(title, (pageWidth - textWidth) / 2, 10);
  
    // Adiciona o subtítulo abaixo do título
    doc.setFontSize(10);
    const subtitleWidth = doc.getTextWidth(subtitle);
    doc.text(subtitle, (pageWidth - subtitleWidth) / 2, 16);
  
    // Alinha a data e hora no canto direito
    doc.setFontSize(10);
    doc.text(dateTime, pageWidth - doc.getTextWidth(dateTime) - 10, 10);
  
    // Gerar tabela com os dados filtrados
    const rows = this.produtos.map(produto => [
      produto.nome ?? '',
      produto.volume ?? '',
      produto.codigo_barras ?? '',
      produto.fornecedor_nome ?? '', // Exibe o nome do fornecedor
      produto.marca ?? ''
    ]);
  
    autoTable(doc, {
      head: [['Nome', 'Volume', 'Código de Barras', 'Fornecedor', 'Marca']],
      body: rows,
      startY: 22
    });
  
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    const x = window.open(url, '_blank');
    if (!x) {
      alert('Habilite pop-ups para visualizar o relatório.');
    }
  }
  
  
}
