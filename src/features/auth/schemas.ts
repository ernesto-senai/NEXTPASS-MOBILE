import { z } from "zod";
import { somenteDigitos } from "@/lib/formatadores";

// Mesmas regras da API (RNF-06, RNF-15), conferidas na hora para o usuário
// corrigir antes de enviar. A API continua validando tudo de novo.

const email = z
  .string()
  .trim()
  .min(1, "Informe o e-mail.")
  .pipe(z.email("Informe um e-mail válido."));

export const loginSchema = z.object({
  email,
  senha: z.string().min(1, "Informe a senha."),
  lembrar: z.boolean(),
});

export type DadosLogin = z.infer<typeof loginSchema>;

export const cadastroSchema = z
  .object({
    perfil: z.enum(["ATLETA", "OLHEIRO"]),
    nome: z.string().trim().min(3, "Informe o nome completo."),
    email,
    telefone: z.string(),
    atuacao: z.enum(["CLUBE", "INDEPENDENTE"]).optional(),
    clube: z.string(),
    senha: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres."),
    confirmacaoSenha: z.string(),
    aceiteTermos: z.boolean(),
  })
  .superRefine(
    (dados, ctx) => {
      const erro = (campo: string, message: string) =>
        ctx.addIssue({ code: "custom", path: [campo], message });

      if (dados.confirmacaoSenha !== dados.senha) erro("confirmacaoSenha", "As senhas não conferem.");
      if (!dados.aceiteTermos) {
        erro("aceiteTermos", "Aceite os Termos de Uso e a Política de Privacidade.");
      }

      if (dados.perfil !== "OLHEIRO") return;
      if (somenteDigitos(dados.telefone).length < 10) {
        erro("telefone", "Informe um telefone válido com DDD.");
      }
      if (!dados.atuacao) erro("atuacao", "Selecione sua atuação.");
      if (dados.atuacao === "CLUBE" && !dados.clube.trim()) {
        erro("clube", "Informe o clube em que você atua.");
      }
    },
    // Roda junto com as regras de cada campo, para mostrar todos os erros de uma vez.
    { when: () => true },
  );

export type DadosCadastro = z.infer<typeof cadastroSchema>;
