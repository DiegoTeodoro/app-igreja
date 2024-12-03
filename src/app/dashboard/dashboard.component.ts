import { Component, OnInit } from '@angular/core';
import { PedidoService } from '../../services/pedido.service';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  pedidos: any[] = [];
  displayedColumns: string[] = ['igreja', 'valorTotal'];
  chartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        label: 'Valor dos Pedidos em Novembro',
        data: [],
        backgroundColor: 'rgba(63, 81, 181, 0.6)',
        borderColor: 'rgba(63, 81, 181, 1)',
        borderWidth: 1
      }
    ]
  };
  chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      }
    }
  };

  constructor(private pedidoService: PedidoService) {}

  ngOnInit(): void {
    this.pedidoService.getPedidos().subscribe(
      (data: any[]) => {
        const mesAtual = new Date().getMonth() + 1; // Mês atual (novembro seria 11)
        const anoAtual = new Date().getFullYear(); // Ano atual
        // Filtra pedidos do mês de novembro
        const pedidosNovembro = data.filter(pedido => {
          const dataPedido = new Date(pedido.data_pedido); // Considerando que `data_pedido` está no formato adequado
          return dataPedido.getMonth() + 1 === mesAtual && dataPedido.getFullYear() === anoAtual;
        });

        this.pedidos = pedidosNovembro.sort((a, b) => b.valor_total - a.valor_total);

        // Prepara os dados para o gráfico
        this.chartData.labels = pedidosNovembro.map(pedido => pedido.igreja_nome);
        this.chartData.datasets[0].data = pedidosNovembro.map(pedido => pedido.valor_total);
      },
      (error) => {
        console.error('Erro ao buscar pedidos', error);
      }
    );
  }

  getValorTotal(): number {
    return this.pedidos.reduce((acc, pedido) => acc + pedido.valor_total, 0);
  }
}
