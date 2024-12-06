import { PedidoCompraItens } from "./PedidoCompraItens";

export interface PedidoCompra {
  id?: number; // Identificador único do pedido (opcional, gerado pelo sistema)
  solicitante: string; // Nome do solicitante
  data: Date; // Data do pedido
  itens: PedidoCompraItens[]; // Lista de itens do pedido
}
