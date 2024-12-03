import { Component, OnInit } from '@angular/core';
import { ProdutoService } from '../../services/produto.service';
import { Produto } from '../models/produto';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; // Importar desta forma

@Component({
  selector: 'app-relatorio-produto',
  templateUrl: './relatorio-produto.component.html',
  styleUrls: ['./relatorio-produto.component.css']
})
export class RelatorioProdutoComponent implements OnInit {
  produtos: Produto[] = [];
  displayedColumns: string[] = ['nome', 'volume', 'codigoBarras', 'fornecedor', 'marca'];
dataAtual: any;

  constructor(private produtoService: ProdutoService) {}

  ngOnInit() {
    this.produtoService.getProdutos().subscribe(
      (data) => {
        this.produtos = data;
      },
      (error) => {
        console.error('Erro ao buscar produtos', error);
      }
    );
  }

  gerarPDF() {
    const doc = new jsPDF({ orientation: 'landscape' });
    const date = new Date();
    const dataAtual = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

    doc.text('Relatório de Cadastro de Produtos - CCLIMP', 140, 10, { align: 'center' });
    doc.text(`Data e Hora: ${dataAtual}`, 260, 20, { align: 'right' });

    const rows = this.produtos.map(produto => [
      produto.nome ?? '', // Use um valor padrão vazio se `produto.nome` for null ou undefined
      produto.volume ?? '',
      produto.codigo_barras ?? '',
      produto.fornecedor_id ?? '',
      produto.marca ?? ''
    ]);
    
    // Use autoTable com a função importada
    autoTable(doc, {
      head: [['Nome', 'Volume', 'Código de Barras', 'Fornecedor', 'Marca']],
      body: rows,
      startY: 30
    });

    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    const x = window.open(url, '_blank');
    if (!x) {
      alert('Habilite pop-ups para visualizar o relatório.');
    }
  }
}
