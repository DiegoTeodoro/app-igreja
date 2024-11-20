export interface Inventario {
  id?: number;
  produto_id: number;
  usuario_id: number;
  quantidade: number;
  data: string; // Alterado de Date para string
}
