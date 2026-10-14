import { TAMANHO_PAGINA } from "./paginacao";

type ValorFiltro = string | number | boolean | readonly string[] | undefined;

// Valor do filtro como texto da URL; vazio quando o filtro não está em uso.
const paraTexto = (valor: ValorFiltro) =>
  Array.isArray(valor) ? valor.join(",") : valor === false ? "" : String(valor ?? "");

// Monta a query das buscas paginadas: ?pagina=1&limite=10&categoria=SUB_17...
export function montarQuery(filtros: object, pagina: number): string {
  const query = new URLSearchParams({ pagina: String(pagina), limite: String(TAMANHO_PAGINA) });
  for (const [chave, valor] of Object.entries(filtros) as [string, ValorFiltro][]) {
    if (paraTexto(valor)) query.set(chave, paraTexto(valor));
  }
  return query.toString();
}

// Escolha única nos chips: tocar de novo na opção marcada desmarca.
export const alternarUnico = <T>(atual: T | undefined, valor: T) =>
  atual === valor ? undefined : valor;

// Escolha múltipla nos chips: marca ou desmarca o valor na lista.
export const alternarNaLista = <T>(lista: readonly T[] = [], valor: T) =>
  lista.includes(valor) ? lista.filter((item) => item !== valor) : [...lista, valor];

// Quantos filtros estão ativos, para o botão "Filtrar (2)". Busca e ordem não contam.
export function contarFiltros(filtros: object): number {
  return (Object.entries(filtros) as [string, ValorFiltro][]).filter(
    ([chave, valor]) => chave !== "busca" && chave !== "ordenar" && paraTexto(valor) !== "",
  ).length;
}
