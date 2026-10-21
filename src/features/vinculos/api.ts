import { api } from "@/services/api/client";
import type { SessaoApi } from "../auth/api";

// RF-15: vínculo na visão do atleta: para quem pediu e se já foi confirmado.
export interface VinculoDoAtleta {
  id: string;
  emailResponsavel: string;
  status: "PENDENTE" | "CONFIRMADO";
  responsavel: { nome: string } | null;
}

// RF-49: atleta acompanhado pelo responsável.
export interface AtletaDoResponsavel {
  vinculoId: string;
  atleta: { id: string; nome: string; fotoUrl: string | null; idade: number | null };
}

// RF-48: o que a tela "Confirmar vínculo" mostra antes do aceite.
export interface PedidoDeVinculo {
  atleta: { nome: string };
  emailResponsavel: string;
  // Com conta, o responsável só confirma a senha; sem conta, cria uma.
  contaExistente: boolean;
}

export interface AceiteDeVinculo {
  token: string;
  senha: string;
  nome?: string;
  aceiteTermos?: boolean;
}

const post = <T>(caminho: string, corpo: unknown) =>
  api<T>(caminho, { method: "POST", body: JSON.stringify(corpo) });

// Rotas de vínculo com o responsável (Endpoints v2.0, seção 5.3).
export const vinculosApi = {
  pedir: (emailResponsavel: string) =>
    post<{ id: string; emailResponsavel: string; status: string }>("/vinculos", {
      emailResponsavel,
    }),
  doAtleta: () => api<VinculoDoAtleta[]>("/vinculos"),
  doResponsavel: () => api<AtletaDoResponsavel[]>("/vinculos"),
  pedido: (token: string) =>
    api<PedidoDeVinculo>(`/vinculos/pedido?token=${encodeURIComponent(token)}`),
  aceitar: (dados: AceiteDeVinculo) => post<SessaoApi>("/responsaveis", dados),
};
