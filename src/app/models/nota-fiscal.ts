export interface NotaFiscal {
  id?: number;
  numero_nota: string;
  serie: string;
  chave_acesso?: string;
  fornecedor_id?: number;
  data_emissao: string; // Alterado para string para aceitar o formato 'YYYY-MM-DD'
  valor_total: number;
  valor_total_nota?: number;
  outros?: number;
  descontos?: number;
  observacoes?: string;
  itensNotaFiscal: any[]; // Lista de itens
}
