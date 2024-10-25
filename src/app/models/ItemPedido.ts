export interface ItemPedido {
  id?: number;
  pedido_id: number;
  produto_id: number;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
}
