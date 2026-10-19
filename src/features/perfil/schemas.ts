import { z } from "zod";
import { deDataIso, idadeEm, lerData, paraDataIso } from "@/lib/datas";
import { ehUf } from "@/lib/uf";
import type { PePreferencial, Posicao } from "@/types/api";
import type { DadosDoAtleta, Perfil } from "./api";

const numeroEntre = (texto: string, min: number, max: number) => {
  const numero = Number(texto);
  return Number.isInteger(numero) && numero >= min && numero <= max;
};

// RF-13: mesmas regras da API, conferidas na hora. Altura e peso são
// digitados como texto (só dígitos) e viram números no envio.
export const perfilAtletaSchema = z.object({
  nome: z.string().trim().min(3, "Informe o nome completo."),
  dataNascimento: z.string().refine((texto) => {
    const data = lerData(texto);
    return !!data && idadeEm(data) >= 6 && idadeEm(data) <= 60;
  }, "Informe uma data válida (DD/MM/AAAA)."),
  posicoes: z
    .array(z.custom<Posicao>())
    .min(1, "Escolha ao menos uma posição.")
    .max(3, "Escolha até 3 posições."),
  alturaCm: z
    .string()
    .refine((texto) => numeroEntre(texto, 100, 230), "Informe a altura em cm (ex.: 174)."),
  pesoKg: z
    .string()
    .refine((texto) => numeroEntre(texto, 20, 150), "Informe o peso em kg (ex.: 68)."),
  pePreferencial: z.custom<PePreferencial>((valor) => !!valor, "Escolha o pé preferencial."),
  cidade: z.string().trim().min(2, "Informe a cidade."),
  uf: z.string().trim().refine(ehUf, "UF inválida."),
  nacionalidade: z.string().trim().min(2, "Informe a nacionalidade."),
});

export type FormularioPerfilAtleta = z.infer<typeof perfilAtletaSchema>;

// Perfil salvo → valores iniciais do formulário (campos vazios se faltar algo).
export function valoresDoPerfil({ nome, atleta }: Perfil): FormularioPerfilAtleta {
  return {
    nome,
    dataNascimento: atleta?.dataNascimento ? deDataIso(atleta.dataNascimento) : "",
    posicoes: atleta?.posicoes ?? [],
    alturaCm: atleta?.alturaCm ? String(atleta.alturaCm) : "",
    pesoKg: atleta?.pesoKg ? String(atleta.pesoKg) : "",
    pePreferencial: atleta?.pePreferencial as PePreferencial,
    cidade: atleta?.cidade ?? "",
    uf: atleta?.uf ?? "",
    nacionalidade: atleta?.nacionalidade ?? "Brasileira",
  };
}

// Formulário → corpo do PATCH /perfil.
export function paraDadosDoAtleta({
  dataNascimento,
  alturaCm,
  pesoKg,
  uf,
  ...dados
}: FormularioPerfilAtleta): DadosDoAtleta {
  return {
    ...dados,
    dataNascimento: paraDataIso(lerData(dataNascimento)!),
    alturaCm: Number(alturaCm),
    pesoKg: Number(pesoKg),
    uf: uf.toUpperCase(),
  };
}
