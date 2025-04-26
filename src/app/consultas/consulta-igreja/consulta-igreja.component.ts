import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-consulta-igreja',
  templateUrl: './consulta-igreja.component.html',
  styleUrls: ['./consulta-igreja.component.css']
})
export class ConsultaIgrejaComponent implements OnInit {
  igrejas: any[] = [];
  setores: any[] = [];

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadSetores(); // Carregar setores primeiro
  }

  loadSetores() {
    this.http.get<any[]>('http://localhost:3000/api/setores').subscribe(data => {
      this.setores = data;
      this.loadIgrejas(); // Só carrega igrejas depois que os setores vierem
    }, error => {
      console.error('Erro ao carregar setores:', error);
    });
  }

  loadIgrejas() {
    this.http.get<any[]>('http://localhost:3000/api/igrejas').subscribe(data => {
      this.igrejas = data.map(igreja => {
        const setor = this.setores.find(s => s.codigo === igreja.codigo_setor);
        return {
          ...igreja,
          setor: setor ? setor.nome : 'Setor não encontrado'
        };
      });
    }, error => {
      console.error('Erro ao carregar igrejas:', error);
    });
  }

  onSelectIgreja(igreja: any) {
    localStorage.setItem('igrejaSelecionada', JSON.stringify(igreja));
    this.router.navigate(['/igreja']); // Voltar para a tela de Cadastro de Igreja
  }
}
