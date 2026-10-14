import { montarQuery } from "@/lib/filtros";
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

// RF-41: dados de "Criar avaliação", com o endereço completo.
export interface NovaAvaliacao {
  nome: string;
  tipo: TipoAvaliacao;
  categoria: Categoria;
  posicoes: Posicao[];
  requisitos: string;
  taxaCentavos: number;
  vagas: number;
  dataHora: string;
  local: string;
  endereco: string;
  cidade: string;
  uf: string;
}

export interface InscricaoDoAtleta {
  id: string;
  status: StatusInscricao;
  avaliacao: AvaliacaoResumo;
}

export type SituacaoInscricao = "ativas" | "participadas";

// RF-42: abas "Próximas" e "Anteriores" das avaliações do olheiro.
export type SituacaoAvaliacao = "proximas" | "anteriores";

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

// Rotas de avaliações e inscrições (Endpoints v2.0, seções 5.6 e 5.7).
export const avaliacoesApi = {
  listar: (pagina: number, filtros: FiltrosAvaliacao = {}) =>
    api<Pagina<AvaliacaoResumo>>(`/avaliacoes?${montarQuery(filtros, pagina)}`),
  minhas: (situacao: SituacaoAvaliacao, pagina: number) =>
    api<Pagina<AvaliacaoResumo>>(
      `/perfil/avaliacoes?situacao=${situacao}&pagina=${pagina}&limite=${TAMANHO_PAGINA}`,
    ),
  cancelar: (id: string) => api<void>(`/avaliacoes/${id}`, { method: "DELETE" }),
  criar: (dados: NovaAvaliacao) =>
    api<AvaliacaoResumo>("/avaliacoes", { method: "POST", body: JSON.stringify(dados) }),
  minhasInscricoes: (situacao: SituacaoInscricao, pagina: number) =>
    api<Pagina<InscricaoDoAtleta>>(
      `/perfil/inscricoes?situacao=${situacao}&pagina=${pagina}&limite=${TAMANHO_PAGINA}`,
    ),
};
