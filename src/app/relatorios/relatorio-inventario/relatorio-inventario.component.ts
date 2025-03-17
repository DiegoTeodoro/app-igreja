import { Component, OnInit } from '@angular/core';
import { InventarioService } from '../../../services/Inventario.Service';

@Component({
  selector: 'app-relatorio-inventario',
  templateUrl: './relatorio-inventario.component.html',
  styleUrls: ['./relatorio-inventario.component.css']
})
export class RelatorioInventarioComponent implements OnInit {
  displayedColumns: string[] = ['produto', 'quantidade', 'data', 'usuario'];
  dataSource: any[] = [];


  constructor(private inventarioService: InventarioService) {}

  ngOnInit(): void {
    this.fetchRelatorio();
  }

  fetchRelatorio(): void {
    this.inventarioService.getRelatorioInventario().subscribe({
      next: (data) => {
        this.dataSource = data.sort((a, b) => 
          new Date(b.data_inventario).getTime() - new Date(a.data_inventario).getTime()
        );
      },
      error: (err) => {
        console.error('Erro ao buscar dados do relatório de inventário:', err);
      },
    });
  }
  
}
