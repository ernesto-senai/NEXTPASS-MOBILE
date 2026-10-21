import { useMutation, useQuery } from "@tanstack/react-query";
import { somenteDigitos } from "@/lib/formatadores";
import { queryClient } from "@/lib/query-client";
import { ApiError } from "@/services/api/client";
import { useSessao } from "@/store/sessao";
import { authApi, type SessaoApi } from "./api";
import type { DadosCadastro, DadosLogin } from "./schemas";

// Guarda a sessão no app. O Stack.Protected do layout raiz leva o usuário para
// a área do perfil assim que a sessão existe. O cache é limpo para não mostrar
// dados da conta anterior no mesmo aparelho.
export async function abrirSessao(resposta: SessaoApi, lembrar: boolean) {
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

// Sai do aparelho sem avisar a API (a conta já não existe mais).
async function limparSessao() {
  await useSessao.getState().encerrar();
  queryClient.clear();
}

// RF-05: pede o link de nova senha por e-mail.
export function usePedirNovaSenha() {
  return useMutation({ mutationFn: authApi.esqueciSenha });
}

// RF-05: troca a senha pelo link do e-mail.
export function useRedefinirSenha() {
  return useMutation({ mutationFn: authApi.redefinirSenha });
}

// RF-56: exclui a conta e volta para o login.
export function useExcluirConta() {
  return useMutation({
    mutationFn: async (senha: string) => {
      await authApi.excluirConta(senha);
      await limparSessao();
    },
  });
}

export function useTermos() {
  return useQuery({ queryKey: ["termos"], queryFn: authApi.termos, staleTime: Infinity });
}
