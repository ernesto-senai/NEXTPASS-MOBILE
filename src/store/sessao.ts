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
  lembrar: boolean;
  carregada: boolean;
  carregar: () => Promise<void>;
  iniciar: (sessao: Sessao, lembrar: boolean) => Promise<void>;
  // Troca os tokens depois de uma renovação, mantendo a escolha do "Lembrar de mim".
  atualizar: (sessao: Sessao) => Promise<void>;
  encerrar: () => Promise<void>;
}

const CHAVE = "nextpass.sessao";

// Os tokens ficam no armazenamento seguro do aparelho (Keychain/Keystore) e só
// persistem entre aberturas do app com "Lembrar de mim" marcado (RF-03).
export const useSessao = create<SessaoState>((set, get) => ({
  sessao: null,
  lembrar: false,
  carregada: false,

  // Se a sessão salva não puder ser lida, o app abre deslogado em vez de travar.
  carregar: async () => {
    try {
      const salva = await armazenamentoSeguro.obter(CHAVE);
      set({
        sessao: salva ? (JSON.parse(salva) as Sessao) : null,
        lembrar: !!salva,
        carregada: true,
      });
    } catch {
      set({ sessao: null, carregada: true });
    }
  },

  iniciar: async (sessao, lembrar) => {
    if (lembrar) await armazenamentoSeguro.salvar(CHAVE, JSON.stringify(sessao));
    set({ sessao, lembrar });
  },

  atualizar: async (sessao) => {
    if (get().lembrar) await armazenamentoSeguro.salvar(CHAVE, JSON.stringify(sessao));
    set({ sessao });
  },

  encerrar: async () => {
    await armazenamentoSeguro.remover(CHAVE);
    set({ sessao: null, lembrar: false });
  },
}));
