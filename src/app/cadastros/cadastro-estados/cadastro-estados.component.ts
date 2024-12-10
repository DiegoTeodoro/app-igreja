import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { EstadoService } from '../../../services/estado.service';

@Component({
  selector: 'app-cadastro-estados',
  templateUrl: './cadastro-estados.component.html',
  styleUrls: ['./cadastro-estados.component.css']
})
export class CadastroEstadosComponent implements OnInit, AfterViewInit {
  estado: any = {};
  displayedColumns: string[] = ['nome', 'sigla', 'actions'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private estadoService: EstadoService) {}

  ngOnInit(): void {
    this.loadEstados();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator; // Associa o paginator ao dataSource
  }

  loadEstados() {
    this.estadoService.getEstados().subscribe((data: any[]) => {
      this.dataSource.data = data; // Carrega os dados no dataSource
    });
  }

  saveEstado() {
    if (this.estado.id) {
      this.estadoService.updateEstado(this.estado.id, this.estado).subscribe(() => {
        this.loadEstados();
        this.estado = {};
      });
    } else {
      this.estadoService.createEstado(this.estado).subscribe(() => {
        this.loadEstados();
        this.estado = {};
      });
    }
  }

  editEstado(estado: any) {
    this.estado = { ...estado };
  }

  deleteEstado(id: number) {
    this.estadoService.deleteEstado(id).subscribe(() => {
      this.loadEstados();
    });
  }
}
