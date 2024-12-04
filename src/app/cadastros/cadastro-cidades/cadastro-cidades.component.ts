import { Component, OnInit } from '@angular/core';
import { CidadeService } from '../../../services/cidade.service';
import { EstadoService } from '../../../services/estado.service';


@Component({
  selector: 'app-cadastro-cidades',
  templateUrl: './cadastro-cidades.component.html',
  styleUrls: ['./cadastro-cidades.component.css']
})
export class CadastroCidadesComponent implements OnInit {
  onDelete(arg0: any) {
  throw new Error('Method not implemented.');
  }
    displayedColumns: string[] = ['nome', 'estado', 'actions'];
    cidades: any[] = [];
    estados: any[] = [];
    cidade: any = {};
  
    constructor(private cidadeService: CidadeService, private estadoService: EstadoService) {}
  
    ngOnInit(): void {
      this.loadCidades();
      this.loadEstados();
    }
  
    loadCidades() {
      this.cidadeService.getCidades().subscribe(
        data => {
          console.log('Cidades carregadas:', data);
          this.cidades = data;
        },
        error => {
          console.error('Erro ao carregar cidades:', error);
        }
      );
    }
  
    loadEstados() {
      this.estadoService.getEstados().subscribe(
        data => {
          console.log('Estados carregados:', data);
          this.estados = data;
        },
        error => {
          console.error('Erro ao carregar estados:', error);
        }
      );
    }
  
    saveCidade() {
      if (this.cidade.id) {
        this.cidadeService.updateCidade(this.cidade.id, this.cidade).subscribe(() => {
          this.loadCidades();
          this.cidade = {};
        });
      } else {
        this.cidadeService.createCidade(this.cidade).subscribe(() => {
          this.loadCidades();
          this.cidade = {};
        });
      }
    }
  
    editCidade(cidade: any) {
      this.cidade = { ...cidade };
    }
  
    deleteCidade(id: number) {
      this.cidadeService.deleteCidade(id).subscribe(() => {
        this.loadCidades();
      });
    }
  
    getEstadoNome(estadoId: number): string {
      const estado = this.estados.find(e => e.id === estadoId);
      return estado ? estado.nome : '';
    }
  }
  