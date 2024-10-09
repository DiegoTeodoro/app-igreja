export class Fornecedor {
  id?: number;
  razao_social: string | undefined;
  nome_fantasia: string | undefined;
  cnpj:  string | undefined;
  inscricao_estadual?: string;
  telefone_fixo?: string;
  telefone_celular?: string;
  email?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cep?: string;
  cidade_codigo?: number;
  uf_codigo?: number;
  ativo: boolean = true;
nome: any;
}
