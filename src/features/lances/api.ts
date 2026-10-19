import { TAMANHO_PAGINA } from "@/lib/paginacao";
import { api, enviarArquivo } from "@/services/api/client";
import type { Pagina } from "@/types/api";
import { type VideoEscolhido, videoParaEnvio } from "./video";

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

// Lance do próprio atleta (RF-25, RF-28).
export interface Lance {
  id: string;
  url: string;
  legenda: string | null;
  localizacao: string | null;
  duracaoSeg: number;
  destaque: boolean;
  criadoEm: string;
}

export type LanceDoAtleta = Lance & { visualizacoes: number };

// RF-31: legenda (null apaga) ou destaque no carrossel.
export interface EdicaoDeLance {
  id: string;
  legenda?: string | null;
  destaque?: boolean;
}

export interface NovoLance {
  video: VideoEscolhido;
  legenda: string;
  localizacao: string;
}

// Rotas de lances (Endpoints v2.0, seção 5.4).
export const lancesApi = {
  feed: (pagina: number) =>
    api<Pagina<LanceDoFeed>>(`/videos?pagina=${pagina}&limite=${TAMANHO_PAGINA}`),
  registrarVisualizacao: (id: string) =>
    api<void>(`/videos/${id}/visualizacoes`, { method: "POST" }),
  // O perfil mostra até 50 lances (o limite de uma página da API).
  meus: () => api<Pagina<LanceDoAtleta>>("/perfil/videos?pagina=1&limite=50"),
  editar: ({ id, ...dados }: EdicaoDeLance) =>
    api<Lance>(`/videos/${id}`, { method: "PATCH", body: JSON.stringify(dados) }),
  excluir: (id: string) => api<void>(`/videos/${id}`, { method: "DELETE" }),
  publicar: ({ video, legenda, localizacao }: NovoLance, onProgresso: (fracao: number) => void) => {
    const dados = new FormData();
    dados.append("legenda", legenda.trim());
    dados.append("localizacao", localizacao.trim());
    dados.append("video", videoParaEnvio(video));
    return enviarArquivo<Lance>("/videos", dados, onProgresso);
  },
};
