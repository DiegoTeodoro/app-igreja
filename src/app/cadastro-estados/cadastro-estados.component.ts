import { Component, OnInit } from '@angular/core';
import { EstadoService } from '../estado.service';

@Component({
  selector: 'app-cadastro-estados',
  templateUrl: './cadastro-estados.component.html',
  styleUrls: ['./cadastro-estados.component.css']
})
export class CadastroEstadosComponent implements OnInit {
  estados: any[] = [];
  estado: any = {};
  displayedColumns: string[] = ['nome', 'sigla', 'actions'];

  constructor(private estadoService: EstadoService) {}

  ngOnInit(): void {
    this.loadEstados();
  }

  loadEstados() {
    this.estadoService.getEstados().subscribe(data => {
      this.estados = data;
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