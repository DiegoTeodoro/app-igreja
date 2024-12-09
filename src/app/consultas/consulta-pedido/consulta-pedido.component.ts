import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PedidoService } from 'src/services/pedido.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ViewChild } from '@angular/core';


@Component({
  selector: 'app-consulta-pedido',
  templateUrl: './consulta-pedido.component.html',
  styleUrls: ['./consulta-pedido.component.css']
})
export class ConsultaPedidoComponent implements OnInit {
  displayedColumns: string[] = ['id', 'igreja', 'dataPedido', 'valorTotal'];
  dataSource = new MatTableDataSource<any>([]); // Usar MatTableDataSource para integração com o paginator
  form: FormGroup;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private pedidoService: PedidoService, private fb: FormBuilder) {
    this.form = this.fb.group({
      numeroPedido: ['']
    });
  }

  ngOnInit(): void {
    this.carregarPedidos();
  }

  carregarPedidos(): void {
    this.pedidoService.getPedidos().subscribe({
      next: (data) => {
        console.log('Dados recebidos da API:', data);
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator; // Conecta o paginator
      },
      error: (error) => console.error('Erro ao carregar pedidos:', error)
    });
  }

  pesquisar(): void {
    const numeroPedido = this.form.value.numeroPedido; // Obtém o número do pedido do formulário
    if (numeroPedido) {
      this.pedidoService.getPedidoById(numeroPedido).subscribe(
        (pedido: any) => {
          console.log('Pedido encontrado:', pedido);
          this.dataSource.data = [pedido]; // Atualiza a tabela com o pedido encontrado
          this.dataSource.paginator = this.paginator; // Reaplica a paginação
        },
        (error: any) => {
          console.error('Erro ao buscar pedido:', error);
          this.dataSource.data = []; // Limpa a tabela se nenhum pedido for encontrado
        }
      );
    }
  }
  
}
