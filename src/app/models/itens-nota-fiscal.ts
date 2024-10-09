export interface ItemNotaFiscal {
    id?: number;
    nota_fiscal_id: number;
    produto_id: number;
    quantidade: number;
    valor_unitario: number;
    valor_total?: number;
    outros?: number;
    desconto?: number;
    created_at?: Date;
    updated_at?: Date;
}