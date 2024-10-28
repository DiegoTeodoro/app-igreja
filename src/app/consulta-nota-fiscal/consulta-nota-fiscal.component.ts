import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NotaFiscalService } from '../nota-fiscal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-consulta-nota-fiscal',
  templateUrl: './consulta-nota-fiscal.component.html',
  styleUrls: ['./consulta-nota-fiscal.component.css']
})
export class ConsultaNotaFiscalComponent implements OnInit {
  displayedColumns: string[] = ['numero_nota', 'chave_acesso', 'data_emissao', 'valor_total'];

  dataSource = new MatTableDataSource<any>();

  constructor(private notaFiscalService: NotaFiscalService, private router: Router) { }

  ngOnInit(): void {
    this.notaFiscalService.getNotasFiscais().subscribe(data => {
      console.log('Dados recebidos:', data);
      this.dataSource.data = data;
    });
  }
  

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  voltarParaCadastro(): void {
    this.router.navigate(['/cadastro-nota-fiscal']);
  }
}
