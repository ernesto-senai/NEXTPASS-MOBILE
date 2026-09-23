import { useMutation, useQuery } from "@tanstack/react-query";
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { somenteDigitos } from "@/lib/formatadores";
import { queryClient } from "@/lib/query-client";
import { ApiError, mensagemDeErro } from "@/services/api/client";
import { useSessao } from "@/store/sessao";
import { authApi, type SessaoApi } from "./api";
import type { DadosCadastro, DadosLogin } from "./schemas";

// Guarda a sessão no app. O Stack.Protected do layout raiz leva o usuário para
// a área do perfil assim que a sessão existe. O cache é limpo para não mostrar
// dados da conta anterior no mesmo aparelho.
async function abrirSessao(resposta: SessaoApi, lembrar: boolean) {
  const { tipo } = resposta.usuario;
  if (tipo === "ADMIN") {
    throw new ApiError(403, "ACESSO_NEGADO", "Contas de administrador usam o painel da equipe.");
  }
  queryClient.clear();
  await useSessao
    .getState()
    .iniciar({ ...resposta, usuario: { ...resposta.usuario, tipo } }, lembrar);
}

export function useEntrar() {
  return useMutation({
    mutationFn: async (dados: DadosLogin) => {
      await abrirSessao(await authApi.entrar(dados), dados.lembrar);
    },
  });
}

export function useCadastrar() {
  return useMutation({
    mutationFn: async (dados: DadosCadastro) => {
      const comum = {
        nome: dados.nome,
        email: dados.email,
        senha: dados.senha,
        aceiteTermos: dados.aceiteTermos,
      };
      const resposta =
        dados.perfil === "OLHEIRO" && dados.atuacao
          ? await authApi.cadastrarOlheiro({
              ...comum,
              telefone: `+55${somenteDigitos(dados.telefone)}`,
              atuacao: dados.atuacao,
              ...(dados.atuacao === "CLUBE" ? { clube: dados.clube.trim() } : {}),
            })
          : await authApi.cadastrarAtleta(comum);

      await abrirSessao(resposta, true);
    },
  });
}

// RF-55: sai da conta. Avisa a API para invalidar o token do aparelho; se ela
// não responder (ex.: sem internet), sai do app do mesmo jeito. Sem sessão, o
// Stack.Protected do layout raiz leva de volta para o login.
export function useSair() {
  return useMutation({
    mutationFn: async () => {
      const { sessao, encerrar } = useSessao.getState();
      if (sessao) await authApi.sair(sessao.refreshToken).catch(() => undefined);
      await encerrar();
      queryClient.clear();
    },
  });
}

export function useTermos() {
  return useQuery({ queryKey: ["termos"], queryFn: authApi.termos, staleTime: Infinity });
}

// Leva os erros da API para os campos do formulário (ex.: e-mail já cadastrado).
// Devolve a mensagem geral quando o erro não pertence a nenhum campo.
export function aplicarErrosDaApi<T extends FieldValues>(
  erro: unknown,
  setError: UseFormSetError<T>,
  campos: readonly Path<T>[],
): string | null {
  if (!(erro instanceof ApiError)) return mensagemDeErro(erro);

  if (erro.codigo === "EMAIL_JA_CADASTRADO" && campos.includes("email" as Path<T>)) {
    setError("email" as Path<T>, { message: erro.message }, { shouldFocus: true });
    return null;
  }

  const comErro = campos.filter((campo) => erro.campos[campo]?.[0]);
  comErro.forEach((campo) => setError(campo, { message: erro.campos[campo]?.[0] }));
  return comErro.length > 0 ? null : erro.message;
}
