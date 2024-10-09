export interface Usuario {
  id: number;
  login: string;
  senha?: string;
  token?: string;
  role: string; // 'admin' ou 'auxiliar'
}
