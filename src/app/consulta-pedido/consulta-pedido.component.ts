import { Component, OnInit } from '@angular/core';
import { PedidoService } from '../../services/pedido.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-consulta-pedido',
  templateUrl: './consulta-pedido.component.html',
  styleUrls: ['./consulta-pedido.component.css']
})
export class ConsultaPedidoComponent implements OnInit {
  pedidos: any[] = [];
  form: FormGroup;
  mensagemErro: string = '';

  constructor(private pedidoService: PedidoService, private fb: FormBuilder) {
    this.form = this.fb.group({
      numeroPedido: ['']
    });
  }

  ngOnInit(): void {}

  pesquisar(): void {
    this.mensagemErro = '';
    const numeroPedido = this.form.get('numeroPedido')?.value;
    if (numeroPedido) {
      this.pedidoService.getPedidoById(numeroPedido).subscribe(
        (result) => {
          if (result) {
            this.pedidos = [result];
          } else {
            this.pedidos = [];
            this.mensagemErro = 'Pedido não encontrado.';
          }
        },
        (error) => {
          console.error('Erro ao buscar pedido:', error.message || error);
          this.mensagemErro = 'Erro ao buscar pedido. Verifique se o número está correto.';
        }
      );
    } else {
      this.pedidoService.getPedidos().subscribe(
        (result) => {
          this.pedidos = result;
        },
        (error) => {
          console.error('Erro ao buscar pedidos:', error.message || error);
          this.mensagemErro = 'Erro ao buscar pedidos.';
        }
      );
    }
  }
}
