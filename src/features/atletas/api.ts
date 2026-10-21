import { montarQuery } from "@/lib/filtros";
import { api } from "@/services/api/client";
import type { Categoria, Pagina, PePreferencial, Posicao } from "@/types/api";
import type { LanceDoAtleta } from "../lances/api";

// Card do atleta na busca do olheiro (RF-37).
export interface AtletaResumo {
  id: string;
  nome: string;
  fotoUrl: string | null;
  posicoes: Posicao[];
  idade: number;
  categoria: Categoria;
  cidade: string;
  uf: string | null;
  nacionalidade: string;
  alturaCm: number;
  pesoKg: number;
  pePreferencial: PePreferencial;
}

// RF-38: perfil do atleta na visão do olheiro, com até 3 lances (os destaques
// primeiro).
export interface AtletaDetalhe extends AtletaResumo {
  lances: LanceDoAtleta[];
  totalLances: number;
}

// RF-35 e RF-36: busca pelo nome e filtros. Campo vazio não filtra.
export interface FiltrosAtleta {
  busca?: string;
  categoria?: Categoria;
  idadeMin?: number;
  idadeMax?: number;
  cidade?: string;
  nacionalidade?: string;
  pe?: PePreferencial;
  pesoMin?: number;
  pesoMax?: number;
  alturaMin?: number;
  alturaMax?: number;
  posicoes?: Posicao[];
  ordenar?: "nome" | "maisNovos" | "maisAltos";
}

// Rotas de atletas (Endpoints v2.0, seção 5.5).
export const atletasApi = {
  buscar: (pagina: number, filtros: FiltrosAtleta = {}) =>
    api<Pagina<AtletaResumo>>(`/atletas?${montarQuery(filtros, pagina)}`),
  detalhe: (id: string) => api<AtletaDetalhe>(`/atletas/${id}`),
};
