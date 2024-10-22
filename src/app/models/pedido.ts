export interface Pedido {
  id?: number;
  igreja_id: number | null;
  data_pedido: Date;
  status: 'Pendente' | 'Processando' | 'Enviado' | 'Entregue' | 'Cancelado';
  valor_total: number;
  observacao?: string;
  recebedor: string;
  pedido_itens: PedidoItem[]; // Lista de itens do pedido
  produto_id?: any;  // Adicionei esse campo também para seu pedido
  valor_unitario?: any; // Opcional para ser usado no form
  quantidade?: any; // Também pode ser usado no form
}

export interface PedidoItem {
  produto_id: number;
  produto_nome: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
}
