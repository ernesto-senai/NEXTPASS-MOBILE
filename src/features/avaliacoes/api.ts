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

// Rotas de avaliações e inscrições (Endpoints v2.0, seções 5.6 e 5.7).
export const avaliacoesApi = {
  listarAbertas: (pagina: number) =>
    api<Pagina<AvaliacaoResumo>>(`/avaliacoes?pagina=${pagina}&limite=${TAMANHO_PAGINA}`),
  minhasInscricoes: (situacao: SituacaoInscricao, pagina: number) =>
    api<Pagina<InscricaoDoAtleta>>(
      `/perfil/inscricoes?situacao=${situacao}&pagina=${pagina}&limite=${TAMANHO_PAGINA}`,
    ),
};
