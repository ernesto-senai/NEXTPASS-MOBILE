import { TAMANHO_PAGINA } from "@/lib/paginacao";
import { api } from "@/services/api/client";
import type { Pagina } from "@/types/api";

// Item do feed de lances do olheiro (RF-32).
export interface LanceDoFeed {
  id: string;
  url: string;
  legenda: string | null;
  localizacao: string | null;
  duracaoSeg: number;
  criadoEm: string;
  visualizacoes: number;
  atleta: { id: string; nome: string; fotoUrl: string | null };
}

// Rotas de lances (Endpoints v2.0, seção 5.4).
export const lancesApi = {
  feed: (pagina: number) =>
    api<Pagina<LanceDoFeed>>(`/videos?pagina=${pagina}&limite=${TAMANHO_PAGINA}`),
  registrarVisualizacao: (id: string) =>
    api<void>(`/videos/${id}/visualizacoes`, { method: "POST" }),
};
