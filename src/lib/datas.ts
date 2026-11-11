// Leitura das datas digitadas com máscara nos formulários.

// Converte "29/11/2026" em data, no fuso do aparelho. Null se o dia não existir (31/02).
export function lerData(texto: string) {
  const [, dia, mes, ano] = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto)?.map(Number) ?? [];
  if (!dia || !mes || !ano) return null;
  const data = new Date(ano, mes - 1, dia);
  return data.getMonth() === mes - 1 && data.getDate() === dia ? data : null;
}

// Converte "15:00" em { horas: 15, minutos: 0 }. Null fora de 00:00 a 23:59.
export function lerHora(texto: string) {
  const [, horas, minutos] = /^(\d{2}):(\d{2})$/.exec(texto)?.map(Number) ?? [];
  if (horas === undefined || minutos === undefined || horas > 23 || minutos > 59) return null;
  return { horas, minutos };
}

// Datas sem horário (ex.: nascimento) vão para a API como "2009-05-10".
export const paraDataIso = (data: Date) =>
  [
    data.getFullYear(),
    String(data.getMonth() + 1).padStart(2, "0"),
    String(data.getDate()).padStart(2, "0"),
  ].join("-");

// Converte "2009-05-10" (ou com horário em UTC) em "10/05/2009" para o campo.
export const deDataIso = (iso: string) => iso.slice(0, 10).split("-").reverse().join("/");

// Idade completa em anos numa data (RN-01).
export function idadeEm(nascimento: Date, hoje = new Date()) {
  const idade = hoje.getFullYear() - nascimento.getFullYear();
  const fezAniversario =
    hoje.getMonth() > nascimento.getMonth() ||
    (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() >= nascimento.getDate());
  return fezAniversario ? idade : idade - 1;
}
