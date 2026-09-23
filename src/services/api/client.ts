import { useSessao } from "@/store/sessao";
import type { ErroApi } from "@/types/api";

const BASE_URL = `${process.env.EXPO_PUBLIC_API_URL}/api/v1`;

// Erro da API com o código fixo que o app usa para tratar cada caso
// (ex.: VAGAS_ESGOTADAS mostra "Vagas esgotadas" no botão).
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly codigo: string,
    mensagem: string,
  ) {
    super(mensagem);
    this.name = "ApiError";
  }
}

export async function api<T>(caminho: string, init: RequestInit = {}): Promise<T> {
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
    throw new ApiError(
      resposta.status,
      erro?.codigo ?? "ERRO_DESCONHECIDO",
      erro?.mensagem ?? "Não foi possível concluir a ação. Tente novamente.",
    );
  }

  return corpo as T;
}
