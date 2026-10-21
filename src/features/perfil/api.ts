import { type ArquivoEscolhido, arquivoParaEnvio } from "@/lib/arquivos";
import { api, enviarArquivo } from "@/services/api/client";
import type { Categoria, PePreferencial, Posicao, TipoUsuario } from "@/types/api";

// Parte do atleta no perfil. Os dados técnicos ficam vazios até ele completar
// o perfil (RF-13); idade e categoria vêm calculadas pela API (RN-01).
export interface PerfilAtleta {
  dataNascimento: string | null;
  posicoes: Posicao[];
  alturaCm: number | null;
  pesoKg: number | null;
  pePreferencial: PePreferencial | null;
  cidade: string | null;
  uf: string | null;
  nacionalidade: string | null;
  // RF-15: situação do vínculo com o responsável (null: nenhum indicado).
  responsavel: "PENDENTE" | "CONFIRMADO" | null;
  idade: number | null;
  categoria: Categoria | null;
  perfilCompleto: boolean;
}

export interface Perfil {
  id: string;
  nome: string;
  email: string;
  fotoUrl: string | null;
  tipo: TipoUsuario;
  atleta: PerfilAtleta | null;
  olheiro: {
    telefone: string;
    atuacao: "CLUBE" | "INDEPENDENTE";
    clube: string | null;
    verificado: boolean;
  } | null;
}

// RF-13: corpo do PATCH /perfil do atleta. A data vai como "2009-05-10".
export interface DadosDoAtleta {
  nome: string;
  dataNascimento: string;
  posicoes: Posicao[];
  alturaCm: number;
  pesoKg: number;
  pePreferencial: PePreferencial;
  cidade: string;
  uf: string;
  nacionalidade: string;
}

// Rotas do perfil (Endpoints v2.0, seção 5.2).
export const perfilApi = {
  buscar: () => api<Perfil>("/perfil"),
  atualizarAtleta: (dados: DadosDoAtleta) =>
    api<Perfil>("/perfil", { method: "PATCH", body: JSON.stringify(dados) }),
  // RF-14: JPG, PNG ou WebP de até 5 MB; a foto nova substitui a anterior.
  trocarFoto: (foto: ArquivoEscolhido) => {
    const dados = new FormData();
    dados.append("foto", arquivoParaEnvio(foto));
    return enviarArquivo<{ fotoUrl: string }>("/perfil/foto", dados, () => undefined);
  },
};
