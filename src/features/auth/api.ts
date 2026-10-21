import { api } from "@/services/api/client";
import type { TipoUsuario } from "@/types/api";

export interface SessaoApi {
  usuario: { id: string; nome: string; tipo: TipoUsuario };
  accessToken: string;
  refreshToken: string;
}

export interface Termos {
  versao: string;
  termosDeUso: string[];
  politicaDePrivacidade: string[];
}

interface DadosCadastroApi {
  nome: string;
  email: string;
  senha: string;
  aceiteTermos: boolean;
}

interface DadosCadastroOlheiroApi extends DadosCadastroApi {
  telefone: string;
  atuacao: "CLUBE" | "INDEPENDENTE";
  clube?: string;
}

const post = <T>(caminho: string, corpo: unknown) =>
  api<T>(caminho, { method: "POST", body: JSON.stringify(corpo) });

// Rotas de autenticação e cadastro (Endpoints v2.0, seções 5.1 e 5.2).
export const authApi = {
  entrar: (dados: { email: string; senha: string; lembrar: boolean }) =>
    post<SessaoApi>("/auth/login", dados),
  cadastrarAtleta: (dados: DadosCadastroApi) => post<SessaoApi>("/atletas", dados),
  cadastrarOlheiro: (dados: DadosCadastroOlheiroApi) => post<SessaoApi>("/olheiros", dados),
  termos: () => api<Termos>("/termos"),
  sair: (refreshToken: string) => post<void>("/auth/logout", { refreshToken }),
  // RF-05: a resposta é a mesma com ou sem conta, para não revelar quem usa o app.
  esqueciSenha: (email: string) => post<void>("/auth/esqueci-senha", { email }),
  redefinirSenha: (dados: { token: string; senha: string }) =>
    post<void>("/auth/redefinir-senha", dados),
  // RF-56: confirma a senha antes de apagar a conta de vez.
  excluirConta: (senha: string) =>
    api<void>("/perfil", { method: "DELETE", body: JSON.stringify({ senha }) }),
};
