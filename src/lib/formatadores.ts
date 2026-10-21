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

// Avisos recentes: "agora", "há 5 min", "há 3 h", "há 2 dias"; depois de uma
// semana, a data.
export function formatarTempoRelativo(iso: string, agora = Date.now()): string {
  const minutos = Math.floor((agora - new Date(iso).getTime()) / 60_000);
  if (minutos < 1) return "agora";
  if (minutos < 60) return `há ${minutos} min`;
  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `há ${horas} h`;
  const dias = Math.floor(horas / 24);
  return dias < 7 ? `há ${dias} ${dias === 1 ? "dia" : "dias"}` : formatarData(iso);
}

// SUB_17 → "Sub-17" (glossário da Documentação do Projeto).
export const formatarCategoria = (categoria: Categoria) =>
  categoria === "PROFISSIONAL" ? "Profissional" : categoria.replace("SUB_", "Sub-");

// RN-01: idade que o atleta completa no ano, por categoria (mesma tabela da API).
const IDADES_NO_ANO: Record<Categoria, readonly [number, number]> = {
  SUB_9: [0, 9],
  SUB_11: [10, 11],
  SUB_13: [12, 13],
  SUB_15: [14, 15],
  SUB_17: [16, 17],
  SUB_20: [18, 20],
  PROFISSIONAL: [21, 150],
};

// "Sub-17 (2009/2010)": a categoria com os anos de nascimento que ela reúne.
export function formatarCategoriaComAnos(categoria: Categoria, ano = new Date().getFullYear()) {
  const [minima, maxima] = IDADES_NO_ANO[categoria];
  const nome = formatarCategoria(categoria);
  if (categoria === "PROFISSIONAL") return `${nome} (${minima} anos ou mais)`;
  if (categoria === "SUB_9") return `${nome} (nascidos a partir de ${ano - maxima})`;
  const [de, ate] = [ano - maxima, ano - minima];
  return `${nome} (${ate - de === 1 ? `${de}/${ate}` : `${de} a ${ate}`})`;
}

const formatoReais = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

// RN-13: taxa informativa da avaliação: 3000 → "R$ 30,00"; 0 → "Gratuita".
export const formatarTaxa = (centavos: number) =>
  centavos === 0 ? "Gratuita" : formatoReais.format(centavos / 100);

// RF-32: 3 → "3 visualizações"; 1234 → "1,2 mil visualizações".
export function formatarVisualizacoes(total: number): string {
  const numero =
    total < 1000
      ? String(total)
      : `${(total / 1000).toFixed(1).replace(".0", "").replace(".", ",")} mil`;
  return `${numero} ${total === 1 ? "visualização" : "visualizações"}`;
}

export const primeiroNome = (nome: string) => nome.trim().split(/\s+/)[0] ?? nome;

// Altura no padrão do glossário: 176 → "1,76 m".
export const formatarAltura = (centimetros: number) =>
  `${(centimetros / 100).toFixed(2).replace(".", ",")} m`;

// Duração do lance: 45 → "0:45".
export const formatarDuracao = (segundos: number) =>
  `${Math.floor(segundos / 60)}:${String(Math.round(segundos) % 60).padStart(2, "0")}`;

// Tamanho de arquivo: 12_900_000 bytes → "12,3 MB".
export const formatarMegabytes = (bytes: number) =>
  `${(bytes / 1024 / 1024).toFixed(1).replace(".", ",")} MB`;

// "Silas Rodrigues" → "SR"; "Palmeiras" → "PA".
export function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/);
  const texto =
    partes.length > 1 ? `${partes[0]![0]}${partes[partes.length - 1]![0]}` : nome.slice(0, 2);
  return texto.toUpperCase();
}

// Máscaras de data e horário enquanto o usuário digita: 29112026 → "29/11/2026"
// e 1500 → "15:00". Funcionam igual no celular e na web, sem seletor nativo.
export function formatarDataDigitada(valor: string): string {
  const digitos = somenteDigitos(valor).slice(0, 8);
  return [digitos.slice(0, 2), digitos.slice(2, 4), digitos.slice(4)].filter(Boolean).join("/");
}

export function formatarHoraDigitada(valor: string): string {
  const digitos = somenteDigitos(valor).slice(0, 4);
  return digitos.length > 2 ? `${digitos.slice(0, 2)}:${digitos.slice(2)}` : digitos;
}

// Valor em reais enquanto o usuário digita, da direita para a esquerda como
// nos apps de banco: 2500 → "25,00". Vazio continua vazio (avaliação gratuita).
export function formatarReaisDigitados(valor: string): string {
  const centavos = Number(somenteDigitos(valor).slice(0, 7));
  return centavos ? (centavos / 100).toFixed(2).replace(".", ",") : "";
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
