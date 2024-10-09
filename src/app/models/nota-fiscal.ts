export interface NotaFiscal {
    id?: number;
    numero_nota: string;
    serie: string;
    chave_acesso?: string;
    data_emissao: Date;
    valor_total: number;
    valor_total_nota?: number;
    outros?: number; // Campo para valor de acréscimos
    descontos?: number; // Campo para valor de descontos
    fornecedor_id?: number;
    cnpj?: string;
    observacoes?: string;
    created_at?: Date;
    updated_at?: Date;
  }
  