import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { type Documentos, verificacaoApi } from "./api";

// RN-04: telas que só o olheiro verificado usa (ex.: Criar avaliação) avisam
// antes de o olheiro preencher tudo.
export function useVerificacao() {
  return useQuery({ queryKey: ["verificacao"], queryFn: verificacaoApi.situacao });
}

// RF-16: envia os documentos com o progresso de 0 a 1; a resposta já é a nova
// situação ("em análise").
export function useEnviarDocumentos() {
  const queryClient = useQueryClient();
  const [progresso, setProgresso] = useState(0);

  const envio = useMutation({
    mutationFn: (documentos: Documentos) => {
      setProgresso(0);
      return verificacaoApi.enviar(documentos, setProgresso);
    },
    onSuccess: (situacao) => queryClient.setQueryData(["verificacao"], situacao),
  });

  return { ...envio, progresso };
}
