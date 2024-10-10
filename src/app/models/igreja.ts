export interface Igreja {
  codigo?: number;
  nome: string;
  codigo_igreja?: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cep: string;
  cidade_codigo?: number;
  uf_codigo?: number;
  codigo_setor?: number;
  ativo: boolean; // Campo ativo como booleano
}


export interface IgrejaDetalhes extends Igreja {
  setor?: string;
  cidade_nome?: string;
  uf_nome?: string;
}

// Tipo combinado para exibição
export type IgrejaComDetalhes = Igreja & IgrejaDetalhes;
