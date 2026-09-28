import { type Sessao, useSessao } from "@/store/sessao";
import type { ErroApi } from "@/types/api";

const BASE_URL = `${process.env.EXPO_PUBLIC_API_URL}/api/v1`;

// Erro da API com o código fixo que o app usa para tratar cada caso
// (ex.: VAGAS_ESGOTADAS mostra "Vagas esgotadas" no botão). Em erros de
// validação (400), `campos` traz a mensagem de cada campo.
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly codigo: string,
    mensagem: string,
    readonly campos: Record<string, string[] | undefined> = {},
  ) {
    super(mensagem);
    this.name = "ApiError";
  }
}

// Mensagem para mostrar ao usuário, inclusive quando a API nem respondeu.
export function mensagemDeErro(erro: unknown): string {
  if (erro instanceof ApiError) return erro.message;
  return "Não foi possível conectar. Confira sua internet e tente de novo.";
}

let renovacaoEmAndamento: Promise<boolean> | null = null;

// RF-03: o token de acesso dura 15 minutos. Quando ele expira, troca o token
// de atualização por um par novo. Se a API recusar, a sessão acabou e o app
// volta para o login; sem internet, mantém a sessão para tentar depois.
// Pedidos simultâneos esperam a mesma renovação.
function renovarSessao(): Promise<boolean> {
  renovacaoEmAndamento ??= (async () => {
    const { sessao, atualizar, encerrar } = useSessao.getState();
    if (!sessao) return false;
    try {
      const resposta = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: sessao.refreshToken }),
      });
      if (!resposta.ok) {
        await encerrar();
        return false;
      }
      const { accessToken, refreshToken } = (await resposta.json()) as Sessao;
      await atualizar({ ...sessao, accessToken, refreshToken });
      return true;
    } catch {
      return false;
    } finally {
      renovacaoEmAndamento = null;
    }
  })();
  return renovacaoEmAndamento;
}

export async function api<T>(caminho: string, init: RequestInit = {}, renovar = true): Promise<T> {
  const token = useSessao.getState().sessao?.accessToken;
  const ehArquivo = init.body instanceof FormData;

  const resposta = await fetch(`${BASE_URL}${caminho}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(ehArquivo ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });

  if (resposta.status === 204) return undefined as T;

  const corpo: unknown = await resposta.json().catch(() => null);

  if (!resposta.ok) {
    const erro = (corpo as ErroApi | null)?.erro;

    // Token de acesso expirado: renova e repete o pedido uma única vez.
    if (erro?.codigo === "TOKEN_INVALIDO" && token && renovar && (await renovarSessao())) {
      return api<T>(caminho, init, false);
    }

    throw new ApiError(
      resposta.status,
      erro?.codigo ?? "ERRO_DESCONHECIDO",
      erro?.mensagem ?? "Não foi possível concluir a ação. Tente novamente.",
      erro?.campos,
    );
  }

  return corpo as T;
}
