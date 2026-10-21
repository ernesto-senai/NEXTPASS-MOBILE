import { api } from "@/services/api/client";
import type { AlvoDenuncia } from "@/types/api";

// RF-54: denúncia de perfil, lance, convite ou avaliação.
export interface NovaDenuncia {
  alvoTipo: AlvoDenuncia;
  alvoId: string;
  motivo: string;
}

// Mesmos limites da API para o motivo.
export const TAMANHO_MOTIVO = { minimo: 10, maximo: 500 } as const;

// Rotas de denúncias (Endpoints v2.0, seção 5.10).
export const denunciasApi = {
  enviar: (dados: NovaDenuncia) =>
    api<{ id: string }>("/denuncias", { method: "POST", body: JSON.stringify(dados) }),
};
