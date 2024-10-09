export interface Empresa {
  id?: number;
  razao_social: string;
  cnpj: string;
  endereco: string;
  numero: string;
  cep: string;
  bairro: string;
  cidade_id: number;
  telefone: string;
  ativo: boolean;  // Adicionando o campo ativo
}
