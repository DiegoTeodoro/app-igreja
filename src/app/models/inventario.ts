export interface Inventario {
  id?: number; 
  produto_id: number;
  usuario_id: number; 
  quantidade: number; 
  observacao?: string; // Observação opcional, já que pode não ser preenchida
  data_inventario: string; // Data e hora do inventário, em formato ISO string
}
