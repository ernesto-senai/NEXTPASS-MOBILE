import { TAMANHO_PAGINA } from "@/lib/paginacao";
import { api } from "@/services/api/client";
import type { Pagina, TipoNotificacao } from "@/types/api";

// Aviso da tela de Notificações (RF-47, RF-52).
export interface Notificacao {
  id: string;
  tipo: TipoNotificacao;
  texto: string;
  dados: Record<string, string> | null;
  lida: boolean;
  criadoEm: string;
}

// A primeira página também traz quantas ainda não foram lidas.
export type PaginaNotificacoes = Pagina<Notificacao> & { naoLidas: number };

// Rotas de notificações (Endpoints v2.0, seção 5.9).
export const notificacoesApi = {
  listar: (pagina: number) =>
    api<PaginaNotificacoes>(`/notificacoes?pagina=${pagina}&limite=${TAMANHO_PAGINA}`),
  // Sem ids, marca todas como lidas.
  marcarComoLidas: (ids?: string[]) =>
    api<void>("/notificacoes", { method: "PATCH", body: JSON.stringify(ids ? { ids } : {}) }),
};
