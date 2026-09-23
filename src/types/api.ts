// Contratos da API NextPass (Endpoints v2.0, Quadro 2).
// Mantenha em sincronia com os enums de prisma/schema.prisma do backend.

export type TipoUsuario = "ATLETA" | "OLHEIRO" | "RESPONSAVEL" | "ADMIN";

export type Categoria =
  | "SUB_9"
  | "SUB_11"
  | "SUB_13"
  | "SUB_15"
  | "SUB_17"
  | "SUB_20"
  | "PROFISSIONAL";

export type Posicao = "GOL" | "ZAG" | "LD" | "LE" | "VOL" | "MEI" | "PD" | "PE" | "ATA";

export type PePreferencial = "DESTRO" | "CANHOTO" | "AMBIDESTRO";

export type StatusVerificacao = "PENDENTE" | "APROVADA" | "RECUSADA";

export type TipoAvaliacao = "PENEIRA" | "TESTE";

export type StatusAvaliacao = "ABERTA" | "ESGOTADA" | "CANCELADA" | "ENCERRADA";

export type StatusInscricao =
  | "AGUARDANDO_RESPONSAVEL"
  | "CONFIRMADA"
  | "CANCELADA"
  | "RECUSADA"
  | "REMOVIDA";

export type StatusConvite = "PENDENTE" | "ACEITO" | "RECUSADO" | "EXPIRADO";

export type AlvoDenuncia = "PERFIL" | "VIDEO" | "CONVITE" | "AVALIACAO";

// Listas paginadas: ?pagina=1&limite=20 (RNF-02).
export interface Pagina<T> {
  dados: T[];
  total: number;
  pagina: number;
}

export interface ErroApi {
  erro: { codigo: string; mensagem: string; campos?: Record<string, string[] | undefined> };
}
