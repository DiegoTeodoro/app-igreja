import { ItemPedido } from "./ItemPedido";

export interface Pedido {
  id?: number;
  igreja_id: number | null;
  data_pedido: Date;
  status: 'Pendente' | 'Processando' | 'Enviado' | 'Entregue' | 'Cancelado';
  valor_total: number;
  observacao?: string;
  recebedor: string;
  pedido_itens: ItemPedido[];  // Lista de itens do pedido
}