import { type Sessao, useSessao } from "@/store/sessao";
import type { ErroApi } from "@/types/api";

const BASE_URL = `${process.env.EXPO_PUBLIC_API_URL}/api/v1`;

// Arquivos guardados pela própria API vêm com caminho relativo
// (/uploads/videos/...); os de outros serviços já vêm com a URL completa.
export const urlDoArquivo = (url: string) =>
  url.startsWith("/") ? `${process.env.EXPO_PUBLIC_API_URL}${url}` : url;

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

// RN-04: a API recusa as funções de olheiro até a verificação ser aprovada.
export const ehOlheiroNaoVerificado = (erro: unknown) =>
  erro instanceof ApiError && erro.codigo === "OLHEIRO_NAO_VERIFICADO";

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
    // Token de acesso expirado: renova e repete o pedido uma única vez.
    if (precisaRenovar(corpo, token, renovar) && (await renovarSessao())) {
      return api<T>(caminho, init, false);
    }
    throw erroDaApi(resposta.status, corpo);
  }

  return corpo as T;
}

// RNF-05: envio de arquivo (multipart/form-data) com o progresso de 0 a 1. O
// fetch não informa o progresso do envio; o XMLHttpRequest informa, no
// celular e na web.
export async function enviarArquivo<T>(
  caminho: string,
  dados: FormData,
  onProgresso: (fracao: number) => void,
  renovar = true,
): Promise<T> {
  const token = useSessao.getState().sessao?.accessToken;

  const { status, corpo } = await new Promise<{ status: number; corpo: unknown }>(
    (resolve, reject) => {
      const pedido = new XMLHttpRequest();
      pedido.open("POST", `${BASE_URL}${caminho}`);
      pedido.setRequestHeader("Accept", "application/json");
      if (token) pedido.setRequestHeader("Authorization", `Bearer ${token}`);
      pedido.upload.onprogress = (evento) => {
        if (evento.lengthComputable) onProgresso(evento.loaded / evento.total);
      };
      pedido.onload = () => resolve({ status: pedido.status, corpo: lerJson(pedido.responseText) });
      pedido.onerror = () => reject(new TypeError("Falha de rede"));
      pedido.send(dados);
    },
  );

  if (status >= 200 && status < 300) return corpo as T;
  if (precisaRenovar(corpo, token, renovar) && (await renovarSessao())) {
    return enviarArquivo<T>(caminho, dados, onProgresso, false);
  }
  throw erroDaApi(status, corpo);
}

const lerJson = (texto: string): unknown => {
  try {
    return JSON.parse(texto);
  } catch {
    return null;
  }
};

const precisaRenovar = (corpo: unknown, token: string | undefined, renovar: boolean) =>
  renovar && !!token && (corpo as ErroApi | null)?.erro?.codigo === "TOKEN_INVALIDO";

function erroDaApi(status: number, corpo: unknown): ApiError {
  const erro = (corpo as ErroApi | null)?.erro;
  return new ApiError(
    status,
    erro?.codigo ?? "ERRO_DESCONHECIDO",
    erro?.mensagem ?? "Não foi possível concluir a ação. Tente novamente.",
    erro?.campos,
  );
}
