import { Component, OnInit } from '@angular/core';
import { PedidoService } from '../../services/pedido.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  quantidadePedidos: number = 0;
  valorTotalPedidos: number = 0;
  chartIgreja: any;
  chartMes: any;

  constructor(private pedidoService: PedidoService) {}

  ngOnInit(): void {
    this.carregarResumo();
    this.carregarGraficoPorIgreja();
    this.carregarGraficoPorMes();
  }

  carregarResumo(): void {
    this.pedidoService.getPedidos().subscribe((pedidos) => {
      this.quantidadePedidos = pedidos.length;
      this.valorTotalPedidos = pedidos.reduce((acc, pedido) => acc + pedido.valor_total, 0);
    });
  }

  carregarGraficoPorIgreja(): void {
    this.pedidoService.getPedidosDetalhados().subscribe((pedidos) => {
      const igrejas = pedidos.map((pedido: any) => pedido.igreja_nome);
      const valores = pedidos.map((pedido: any) => pedido.valor_total);

      const ctx = document.getElementById('chartIgreja') as HTMLCanvasElement;
      this.chartIgreja = new Chart(ctx, {
        type: 'line',
        data: {
          labels: igrejas,
          datasets: [
            {
              label: 'Valor dos Pedidos',
              data: valores,
              backgroundColor: '#007bff',
              borderColor: '#007bff',
              borderWidth: 2,
              fill: false, // Opcional: remove preenchimento do gráfico de linha
            },
          ],
        },
      });
    });
  }

  carregarGraficoPorMes(): void {
    this.pedidoService.getPedidosDetalhados().subscribe((pedidos) => {
      const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto',
        'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
      const valoresPorMes = new Array(12).fill(0);

      pedidos.forEach((pedido: any) => {
        const mes = new Date(pedido.data_pedido).getMonth();
        valoresPorMes[mes] += pedido.valor_total;
      });

      const ctx = document.getElementById('chartMes') as HTMLCanvasElement;
      this.chartMes = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: meses,
          datasets: [
            {
              label: 'Valor dos Pedidos',
              data: valoresPorMes,
              backgroundColor: '#007bff',
              borderColor: '#007bff',
              borderWidth: 1,
            },
          ],
        },
      });
    });
  }
}
