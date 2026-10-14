import { TAMANHO_PAGINA } from "@/lib/paginacao";
import { api } from "@/services/api/client";
import type {
  Categoria,
  Pagina,
  Posicao,
  StatusAvaliacao,
  StatusInscricao,
  TipoAvaliacao,
} from "@/types/api";

// Card da avaliação (RF-18). Sem o endereço completo, que só aparece depois
// da confirmação (RN-08).
export interface AvaliacaoResumo {
  id: string;
  nome: string;
  tipo: TipoAvaliacao;
  categoria: Categoria;
  posicoes: Posicao[];
  dataHora: string;
  local: string;
  cidade: string;
  uf: string;
  taxaCentavos: number;
  vagas: number;
  vagasOcupadas: number;
  status: StatusAvaliacao;
  clube: string | null;
  olheiro: { id: string; nome: string };
}

export interface InscricaoDoAtleta {
  id: string;
  status: StatusInscricao;
  avaliacao: AvaliacaoResumo;
}

export type SituacaoInscricao = "ativas" | "participadas";

// RF-23 e RF-24: busca e filtros da tela de Pesquisa. Campo vazio não filtra.
export interface FiltrosAvaliacao {
  busca?: string;
  categoria?: Categoria;
  tipo?: TipoAvaliacao;
  cidade?: string;
  posicoes?: Posicao[];
  precoMax?: number;
  dias?: number;
  comVagas?: boolean;
  ordenar?: "proximas" | "recentes" | "menorPreco";
}

// Valor do filtro como texto da URL; vazio quando o filtro não está em uso.
const paraTexto = (valor: FiltrosAvaliacao[keyof FiltrosAvaliacao]) =>
  Array.isArray(valor) ? valor.join(",") : valor === false ? "" : String(valor ?? "");

// Quantos filtros estão ativos, para o botão "Filtrar (2)". Busca e ordem não contam.
export function contarFiltros(filtros: FiltrosAvaliacao): number {
  return Object.entries(filtros).filter(
    ([chave, valor]) => chave !== "busca" && chave !== "ordenar" && paraTexto(valor) !== "",
  ).length;
}

function paraQuery(filtros: FiltrosAvaliacao, pagina: number): string {
  const query = new URLSearchParams({ pagina: String(pagina), limite: String(TAMANHO_PAGINA) });
  for (const [chave, valor] of Object.entries(filtros)) {
    if (paraTexto(valor)) query.set(chave, paraTexto(valor));
  }
  return query.toString();
}

// Rotas de avaliações e inscrições (Endpoints v2.0, seções 5.6 e 5.7).
export const avaliacoesApi = {
  listar: (pagina: number, filtros: FiltrosAvaliacao = {}) =>
    api<Pagina<AvaliacaoResumo>>(`/avaliacoes?${paraQuery(filtros, pagina)}`),
  minhasInscricoes: (situacao: SituacaoInscricao, pagina: number) =>
    api<Pagina<InscricaoDoAtleta>>(
      `/perfil/inscricoes?situacao=${situacao}&pagina=${pagina}&limite=${TAMANHO_PAGINA}`,
    ),
};
