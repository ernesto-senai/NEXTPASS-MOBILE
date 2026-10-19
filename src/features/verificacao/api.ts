import { api } from "@/services/api/client";
import type { StatusVerificacao } from "@/types/api";

// RF-17: situação da verificação do olheiro. status null: os documentos
// ainda não foram enviados.
export interface SituacaoVerificacao {
  verificado: boolean;
  status: StatusVerificacao | null;
  motivoRecusa: string | null;
}

// Rotas de verificação (Endpoints v2.0, seção 5.3).
export const verificacaoApi = {
  situacao: () => api<SituacaoVerificacao>("/perfil/verificacao"),
};
