import { armazenamentoSeguro } from "@/lib/armazenamento-seguro";
import { create } from "zustand";
import type { TipoUsuario } from "@/types/api";

// O administrador usa o painel da equipe, não o app.
export type TipoUsuarioApp = Exclude<TipoUsuario, "ADMIN">;

export interface Sessao {
  usuario: { id: string; nome: string; tipo: TipoUsuarioApp };
  accessToken: string;
  refreshToken: string;
}

interface SessaoState {
  sessao: Sessao | null;
  carregada: boolean;
  carregar: () => Promise<void>;
  iniciar: (sessao: Sessao, lembrar: boolean) => Promise<void>;
  encerrar: () => Promise<void>;
}

const CHAVE = "nextpass.sessao";

// Os tokens ficam no armazenamento seguro do aparelho (Keychain/Keystore) e só
// persistem entre aberturas do app com "Lembrar de mim" marcado (RF-03).
export const useSessao = create<SessaoState>((set) => ({
  sessao: null,
  carregada: false,

  carregar: async () => {
    const salva = await armazenamentoSeguro.obter(CHAVE);
    set({ sessao: salva ? (JSON.parse(salva) as Sessao) : null, carregada: true });
  },

  iniciar: async (sessao, lembrar) => {
    if (lembrar) await armazenamentoSeguro.salvar(CHAVE, JSON.stringify(sessao));
    set({ sessao });
  },

  encerrar: async () => {
    await armazenamentoSeguro.remover(CHAVE);
    set({ sessao: null });
  },
}));
