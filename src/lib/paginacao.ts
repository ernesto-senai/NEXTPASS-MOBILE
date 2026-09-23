import type { Pagina } from "@/types/api";

// Itens por página nas listas do app (a API aceita até 50, RNF-02).
export const TAMANHO_PAGINA = 10;

// Para o useInfiniteQuery: número da próxima página, ou undefined no fim da lista.
export function proximaPagina(ultima: Pagina<unknown>): number | undefined {
  return ultima.pagina * TAMANHO_PAGINA < ultima.total ? ultima.pagina + 1 : undefined;
}
