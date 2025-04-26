import { Component, OnInit } from '@angular/core';
import { FornecedorService } from '../../../services/fornecedor.service';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-relatorio-fornecedor',
  templateUrl: './relatorio-fornecedor.component.html',
  styleUrls: ['./relatorio-fornecedor.component.css']
})
export class RelatorioFornecedorComponent implements OnInit {
  fornecedores: any[] = [];

  constructor(private fornecedorService: FornecedorService) {}

  ngOnInit(): void {
    this.carregarFornecedores();
  }

  carregarFornecedores(): void {
    this.fornecedorService.getFornecedores().subscribe((fornecedores: any[]) => {
      this.fornecedores = fornecedores;
    });
  }

  gerarRelatorioPDF(): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const title = 'Relatório de Fornecedores - CNS';
    const subtitle = 'CCB - Parque São Jorge, R. Antônio Paiva Catalão, Nº 548.';
    const dateTime = new Date().toLocaleString();

    // Cabeçalho
    doc.setFontSize(14);
    const textWidth = doc.getTextWidth(title);
    doc.text(title, (pageWidth - textWidth) / 2, 10);

    doc.setFontSize(10);
    const subtitleWidth = doc.getTextWidth(subtitle);
    doc.text(subtitle, (pageWidth - subtitleWidth) / 2, 16);

    doc.text(dateTime, pageWidth - doc.getTextWidth(dateTime) - 10, 10);

    // Tabela manual
    let startY = 25;
    doc.setFontSize(10);
    doc.text('Código', 10, startY);
    doc.text('Razão Social', 30, startY);
    doc.text('Nome Fantasia', 100, startY);
    doc.text('CNPJ', 160, startY);

    startY += 6;

    this.fornecedores.forEach((fornecedor, index) => {
      if (startY > 280) { // Quebra de página se necessário
        doc.addPage();
        startY = 20;
      }
      doc.text(fornecedor.id.toString(), 10, startY);
      doc.text(fornecedor.razao_social || '', 30, startY);
      doc.text(fornecedor.nome_fantasia || '', 100, startY);
      doc.text(fornecedor.cnpj || '', 160, startY);
      startY += 6;
    });

    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    const x = window.open(url, '_blank');
    if (!x) {
      alert('Habilite pop-ups para visualizar o relatório.');
    }
  }
}
