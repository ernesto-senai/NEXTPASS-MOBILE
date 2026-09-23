import type { Categoria } from "@/types/api";

// Só os dígitos de um texto (ex.: telefone com máscara).
export const somenteDigitos = (valor: string) => valor.replace(/\D/g, "");

const formatoData = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});
const formatoHora = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" });

// Datas da API vêm em ISO 8601; aparecem no fuso do aparelho: 14/09/2026 e 07:30.
export const formatarData = (iso: string) => formatoData.format(new Date(iso));
export const formatarHora = (iso: string) => formatoHora.format(new Date(iso));

// SUB_17 → "Sub-17" (glossário da Documentação do Projeto).
export const formatarCategoria = (categoria: Categoria) =>
  categoria === "PROFISSIONAL" ? "Profissional" : categoria.replace("SUB_", "Sub-");

// RF-32: 3 → "3 visualizações"; 1234 → "1,2 mil visualizações".
export function formatarVisualizacoes(total: number): string {
  const numero =
    total < 1000
      ? String(total)
      : `${(total / 1000).toFixed(1).replace(".0", "").replace(".", ",")} mil`;
  return `${numero} ${total === 1 ? "visualização" : "visualizações"}`;
}

export const primeiroNome = (nome: string) => nome.trim().split(/\s+/)[0] ?? nome;

// "Silas Rodrigues" → "SR"; "Palmeiras" → "PA".
export function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/);
  const texto =
    partes.length > 1 ? `${partes[0]![0]}${partes[partes.length - 1]![0]}` : nome.slice(0, 2);
  return texto.toUpperCase();
}

// RNF-15: máscara do telefone enquanto o usuário digita. O "+55" fica fixo
// fora do campo, então aqui entra só DDD e número: (11) 91234-5678.
export function formatarTelefone(valor: string): string {
  const digitos = somenteDigitos(valor).slice(0, 11);
  if (digitos.length === 0) return "";
  if (digitos.length <= 2) return `(${digitos}`;

  const ddd = digitos.slice(0, 2);
  const numero = digitos.slice(2);
  const tamanhoInicio = numero.length > 8 ? 5 : 4;
  const inicio = numero.slice(0, tamanhoInicio);
  const fim = numero.slice(tamanhoInicio);

  return `(${ddd}) ${inicio}${fim ? `-${fim}` : ""}`;
}
