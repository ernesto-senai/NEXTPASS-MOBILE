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
  // Na visão do responsável, de qual atleta vinculado é o convite (RF-49).
  atleta: { id: string; nome: string };
}

// RF-39 e RF-40: convite do olheiro para uma avaliação própria (RN-11).
export interface NovoConvite {
  atletaId: string;
  avaliacaoId: string;
  mensagem: string;
}

// RN-10: a mensagem do convite tem até 300 caracteres.
export const TAMANHO_MAXIMO_MENSAGEM = 300;

export interface ConviteEnviado {
  id: string;
  status: StatusConvite;
  avaliacao: { id: string; nome: string; dataHora: string };
  // RN-03: o responsável do atleta menor também recebeu uma cópia.
  copiaResponsavel: boolean;
}

// Rotas de convites (Endpoints v2.0, seção 5.8).
export const convitesApi = {
  recebidos: (pagina: number) =>
    api<Pagina<ConviteRecebido>>(`/convites?pagina=${pagina}&limite=${TAMANHO_PAGINA}`),
  enviar: (dados: NovoConvite) =>
    api<ConviteEnviado>("/convites", { method: "POST", body: JSON.stringify(dados) }),
  responder: ({ id, status }: { id: string; status: RespostaConvite }) =>
    api<{ id: string; status: RespostaConvite }>(`/convites/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};
