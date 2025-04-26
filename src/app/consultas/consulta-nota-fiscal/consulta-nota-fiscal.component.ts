import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NotaFiscalService } from '../../../services/nota-fiscal.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent, MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-consulta-nota-fiscal',
  templateUrl: './consulta-nota-fiscal.component.html',
  styleUrls: ['./consulta-nota-fiscal.component.css'],
})
export class ConsultaNotaFiscalComponent implements OnInit {
  numeroNotaPesquisa: string = '';
  displayedColumns: string[] = ['numeroNota', 'dataEmissao', 'valorTotal'];
  notasFiscais = new MatTableDataSource<any>([]);
  pageSize = 8;
  pageIndex = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private notaFiscalService: NotaFiscalService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.carregarTodasNotasFiscais();
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.notasFiscais.paginator = this.paginator;
    }
  }

  pesquisarNota(): void {
    if (!this.numeroNotaPesquisa) {
      this.snackBar.open('Informe o número da nota para pesquisa.', 'Fechar', {
        duration: 3000,
      });
      return;
    }

    this.notaFiscalService.getNotaFiscalByNumero(this.numeroNotaPesquisa).subscribe(
      (notas: any[]) => {
        if (notas.length > 0) {
          this.notasFiscais.data = notas;
        } else {
          this.snackBar.open('Nota Fiscal não encontrada.', 'Fechar', {
            duration: 3000,
          });
        }
      },
      (error: any) => {
        console.error('Erro ao consultar nota fiscal:', error);
        this.snackBar.open('Erro ao consultar a Nota Fiscal.', 'Fechar', {
          duration: 3000,
        });
      }
    );
  }

  carregarTodasNotasFiscais(): void {
    this.notaFiscalService.getNotasFiscais().subscribe(
      (notas: any[]) => {
        this.notasFiscais.data = notas;
        this.notasFiscais.paginator = this.paginator;
      },
      (error: any) => {
        console.error('Erro ao carregar notas fiscais:', error);
        this.snackBar.open('Erro ao carregar as Notas Fiscais.', 'Fechar', {
          duration: 3000,
        });
      }
    );
  }

  handlePageEvent(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
  }
}
