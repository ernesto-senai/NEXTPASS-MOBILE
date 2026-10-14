import { z } from "zod";
import { lerData, lerHora } from "@/lib/datas";
import { somenteDigitos } from "@/lib/formatadores";
import { ehUf } from "@/lib/uf";
import type { Categoria, Posicao, TipoAvaliacao } from "@/types/api";
import type { NovaAvaliacao } from "./api";

function lerDataHora(data: string, hora: string) {
  const dia = lerData(data);
  const horario = lerHora(hora);
  if (!dia || !horario) return null;
  dia.setHours(horario.horas, horario.minutos);
  return dia;
}

// RF-41: mesmas regras da API, conferidas na hora. Data e horário são
// digitados com máscara e viram um único dataHora no envio.
export const avaliacaoSchema = z
  .object({
    tipo: z.custom<TipoAvaliacao>(),
    nome: z.string().trim().min(3, "Informe o nome da avaliação."),
    categoria: z.custom<Categoria>((valor) => !!valor, "Escolha a categoria."),
    posicoes: z.array(z.custom<Posicao>()).min(1, "Escolha ao menos uma posição."),
    requisitos: z.string().trim().min(3, "Informe o que o atleta precisa levar."),
    taxa: z.string(),
    vagas: z.number().min(1, "Informe ao menos 1 vaga."),
    data: z.string().refine((texto) => !!lerData(texto), "Informe uma data válida."),
    hora: z.string().refine((texto) => !!lerHora(texto), "Informe um horário válido."),
    local: z.string().trim().min(2, "Informe o nome do local."),
    endereco: z.string().trim().min(5, "Informe rua, número e bairro."),
    cidade: z.string().trim().min(2, "Informe a cidade."),
    uf: z.string().trim().refine(ehUf, "UF inválida."),
  })
  .superRefine(
    ({ data, hora }, ctx) => {
      const dataHora = lerDataHora(data, hora);
      if (dataHora && dataHora <= new Date()) {
        ctx.addIssue({ code: "custom", path: ["data"], message: "Escolha uma data futura." });
      }
    },
    // Roda junto com as regras de cada campo, para mostrar todos os erros de uma vez.
    { when: () => true },
  );

export type DadosAvaliacao = z.infer<typeof avaliacaoSchema>;

// Formulário → corpo do POST /avaliacoes.
export function paraNovaAvaliacao({
  data,
  hora,
  taxa,
  uf,
  ...dados
}: DadosAvaliacao): NovaAvaliacao {
  return {
    ...dados,
    uf: uf.toUpperCase(),
    taxaCentavos: Number(somenteDigitos(taxa)),
    dataHora: lerDataHora(data, hora)!.toISOString(),
  };
}
