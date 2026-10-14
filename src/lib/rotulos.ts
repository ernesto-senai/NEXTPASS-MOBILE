import type { Categoria, Posicao, TipoAvaliacao } from "@/types/api";
import { formatarCategoria } from "./formatadores";

// Opções exibidas em filtros e formulários, com os termos do glossário.

export const CATEGORIAS = (
  ["SUB_9", "SUB_11", "SUB_13", "SUB_15", "SUB_17", "SUB_20", "PROFISSIONAL"] as const
).map((valor) => ({ valor, rotulo: formatarCategoria(valor) })) satisfies {
  valor: Categoria;
  rotulo: string;
}[];

export const TIPOS_AVALIACAO = [
  { valor: "PENEIRA", rotulo: "Peneira" },
  { valor: "TESTE", rotulo: "Teste" },
] as const satisfies readonly { valor: TipoAvaliacao; rotulo: string }[];

export const POSICOES = [
  { valor: "GOL", rotulo: "Goleiro" },
  { valor: "ZAG", rotulo: "Zagueiro" },
  { valor: "LD", rotulo: "Lateral direito" },
  { valor: "LE", rotulo: "Lateral esquerdo" },
  { valor: "VOL", rotulo: "Volante" },
  { valor: "MEI", rotulo: "Meia" },
  { valor: "PD", rotulo: "Ponta direita" },
  { valor: "PE", rotulo: "Ponta esquerda" },
  { valor: "ATA", rotulo: "Atacante" },
] as const satisfies readonly { valor: Posicao; rotulo: string }[];
