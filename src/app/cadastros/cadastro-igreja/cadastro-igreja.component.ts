import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { Igreja, IgrejaDetalhes } from '../../models/igreja';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cadastro-igreja',
  templateUrl: './cadastro-igreja.component.html',
  styleUrls: ['./cadastro-igreja.component.css']
})
export class CadastroIgrejaComponent implements OnInit {
  displayedColumns: string[] = ['codigo_igreja', 'nome', 'setor'];
  igrejas = new MatTableDataSource<IgrejaDetalhes>();
  igreja: Igreja = this.createEmptyIgreja();
  setores: any[] = [];
  cidades: any[] = [];
  estados: any[] = [];
  showTable: boolean = false; // Para controlar a exibição da tabela

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.loadSetores();
    this.loadCidades();
    this.loadEstados();
    this.loadIgrejas();
  }

  createEmptyIgreja(): Igreja {
    return {
      codigo: undefined,
      nome: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cep: '',
      cidade_codigo: undefined,
      uf_codigo: undefined,
      codigo_setor: undefined,
      ativo: false
    };
  }

  // Alterna a exibição entre a tabela e o formulário
  toggleTable() {
    this.showTable = !this.showTable;
  }

  loadIgrejas() {
    this.http.get<IgrejaDetalhes[]>('http://localhost:3000/igrejas').subscribe((data: IgrejaDetalhes[]) => {
      this.igrejas.data = data.map(igreja => {
        const setor = this.setores.find(s => s.codigo === igreja.codigo_setor); // Associa o setor à igreja
        return {
          ...igreja,
          setor: setor ? setor.nome : 'Setor não encontrado'  // Adiciona o nome do setor
        };
      });
    }, error => {
      console.error('Erro ao carregar igrejas:', error);
    });
  }

  // Carrega os setores
  loadSetores() {
    this.http.get<any[]>('http://localhost:3000/setores').subscribe((data) => {
      this.setores = data;
    }, error => {
      console.error('Erro ao carregar setores:', error);
    });
  }

  // Carrega as cidades
  loadCidades() {
    this.http.get<any[]>('http://localhost:3000/cidades').subscribe((data) => {
      this.cidades = data;
    }, error => {
      console.error('Erro ao carregar cidades:', error);
    });
  }

  // Carrega os estados
  loadEstados() {
    this.http.get<any[]>('http://localhost:3000/estados').subscribe((data) => {
      this.estados = data;
    }, error => {
      console.error('Erro ao carregar estados:', error);
    });
  }

  // Função chamada ao clicar em uma linha da tabela
  onSelectIgreja(igreja: IgrejaDetalhes) {
    this.igreja = {
      codigo: igreja.codigo,
      nome: igreja.nome,
      codigo_igreja: igreja.codigo_igreja,
      logradouro: igreja.logradouro,
      numero: igreja.numero,
      complemento: igreja.complemento,
      bairro: igreja.bairro,
      cep: igreja.cep,
      cidade_codigo: igreja.cidade_codigo,
      uf_codigo: igreja.uf_codigo,
      codigo_setor: igreja.codigo_setor,
      ativo: igreja.ativo // Preenche o campo ativo corretamente
    };
    this.toggleTable(); // Volta para o formulário de edição
  }
  

  onSubmit() {
    if (this.igreja.codigo) {
      // Atualizar igreja existente
      this.http.put(`http://localhost:3000/igrejas/${this.igreja.codigo}`, this.igreja).subscribe(() => {
        this.loadIgrejas();
        this.resetForm();
        this.showSuccessMessage('Igreja atualizada com sucesso!');
      });
    } else {
      // Criar nova igreja
      this.http.post('http://localhost:3000/igrejas', this.igreja).subscribe(() => {
        this.loadIgrejas();
        this.resetForm();
        this.showSuccessMessage('Igreja criada com sucesso!');
      });
    }
  }

  resetForm() {
    this.igreja = this.createEmptyIgreja();
  }

  showSuccessMessage(message: string) {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000
    });
  }
  onCancel() {
    this.resetForm();  // Reseta o formulário
    this.showSuccessMessage('Operação cancelada');
  }
  
  
}
