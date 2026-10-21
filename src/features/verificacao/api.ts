import { type ArquivoEscolhido, arquivoParaEnvio } from "@/lib/arquivos";
import { api, enviarArquivo } from "@/services/api/client";
import type { StatusVerificacao } from "@/types/api";

// RF-17: situação da verificação do olheiro. status null: os documentos
// ainda não foram enviados.
export interface SituacaoVerificacao {
  verificado: boolean;
  status: StatusVerificacao | null;
  motivoRecusa: string | null;
}

// RF-16: os mesmos limites da API, conferidos antes do envio.
export const LIMITES_DOCUMENTO = {
  formatos: ["image/jpeg", "image/png", "application/pdf"],
  tamanhoMaxMb: 10,
} as const;

// RF-16 e RN-05: documento com foto e, para quem atua por clube, o comprovante.
export interface Documentos {
  documento: ArquivoEscolhido;
  comprovante?: ArquivoEscolhido | null | undefined;
}

// Rotas de verificação (Endpoints v2.0, seção 5.3).
export const verificacaoApi = {
  situacao: () => api<SituacaoVerificacao>("/perfil/verificacao"),
  enviar: ({ documento, comprovante }: Documentos, onProgresso: (fracao: number) => void) => {
    const dados = new FormData();
    dados.append("documento", arquivoParaEnvio(documento));
    if (comprovante) dados.append("comprovante", arquivoParaEnvio(comprovante));
    return enviarArquivo<SituacaoVerificacao>("/perfil/verificacao", dados, onProgresso);
  },
};
