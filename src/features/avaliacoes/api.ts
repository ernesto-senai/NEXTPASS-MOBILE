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

// RF-20: detalhes da avaliação. O endereço completo só vem para o dono e para
// quem já está confirmado (RN-08).
export interface AvaliacaoDetalhe extends AvaliacaoResumo {
  requisitos: string;
  endereco: string | null;
  minhaInscricao: { id: string; status: StatusInscricao } | null;
}

// RF-44: participante na lista do olheiro.
export interface Participante {
  id: string;
  status: StatusInscricao;
  atleta: {
    id: string;
    nome: string;
    fotoUrl: string | null;
    idade: number | null;
    posicoes: Posicao[];
    cidade: string | null;
    uf: string | null;
  };
}

// RF-22 (atleta cancela), RF-46 (olheiro remove) e RF-50 (responsável decide).
export type NovoStatusInscricao = "CANCELADA" | "REMOVIDA" | "CONFIRMADA" | "RECUSADA";

export interface InscricaoDoAtleta {
  id: string;
  status: StatusInscricao;
  avaliacao: AvaliacaoResumo;
}

// RF-50: inscrição de um atleta vinculado esperando a aprovação do responsável.
export interface InscricaoParaAprovar extends InscricaoDoAtleta {
  atleta: { id: string; nome: string };
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
  detalhe: (id: string) => api<AvaliacaoDetalhe>(`/avaliacoes/${id}`),
  cancelar: (id: string) => api<void>(`/avaliacoes/${id}`, { method: "DELETE" }),
  criar: (dados: NovaAvaliacao) =>
    api<AvaliacaoResumo>("/avaliacoes", { method: "POST", body: JSON.stringify(dados) }),
  editar: ({ id, ...dados }: NovaAvaliacao & { id: string }) =>
    api<AvaliacaoResumo>(`/avaliacoes/${id}`, { method: "PATCH", body: JSON.stringify(dados) }),
  participar: (id: string) =>
    api<{ id: string; status: StatusInscricao }>(`/avaliacoes/${id}/inscricoes`, {
      method: "POST",
    }),
  alterarInscricao: ({ id, status }: { id: string; status: NovoStatusInscricao }) =>
    api<{ id: string; status: StatusInscricao }>(`/inscricoes/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  participantes: (id: string, busca: string, pagina: number) =>
    api<Pagina<Participante>>(`/avaliacoes/${id}/inscricoes?${montarQuery({ busca }, pagina)}`),
  // RF-50: para o responsável, a mesma rota traz as inscrições a aprovar.
  paraAprovar: (pagina: number) =>
    api<Pagina<InscricaoParaAprovar>>(
      `/perfil/inscricoes?pagina=${pagina}&limite=${TAMANHO_PAGINA}`,
    ),
  minhasInscricoes: (situacao: SituacaoInscricao, pagina: number) =>
    api<Pagina<InscricaoDoAtleta>>(
      `/perfil/inscricoes?situacao=${situacao}&pagina=${pagina}&limite=${TAMANHO_PAGINA}`,
    ),
};
