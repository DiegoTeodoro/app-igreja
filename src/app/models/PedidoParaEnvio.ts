import { Pedido } from "./Pedido";

export interface PedidoParaEnvio extends Omit<Pedido, 'data_pedido'> {
  data_pedido: string;
}
