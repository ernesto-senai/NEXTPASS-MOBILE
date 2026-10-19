import { TAMANHO_PAGINA } from "@/lib/paginacao";
import { api } from "@/services/api/client";
import type { Pagina, StatusConvite, StatusInscricao } from "@/types/api";
import type { AvaliacaoResumo } from "../avaliacoes/api";

export type RespostaConvite = "ACEITO" | "RECUSADO";

// Card da caixa de convites (RF-26). A inscrição existe depois do aceite; a
// do menor de 18 anos aguarda o responsável (RN-03).
export interface ConviteRecebido {
  id: string;
  status: StatusConvite;
  mensagem: string;
  criadoEm: string;
  avaliacao: AvaliacaoResumo;
  inscricao: { id: string; status: StatusInscricao } | null;
}

// Rotas de convites (Endpoints v2.0, seção 5.8).
export const convitesApi = {
  recebidos: (pagina: number) =>
    api<Pagina<ConviteRecebido>>(`/convites?pagina=${pagina}&limite=${TAMANHO_PAGINA}`),
  responder: ({ id, status }: { id: string; status: RespostaConvite }) =>
    api<{ id: string; status: RespostaConvite }>(`/convites/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};
