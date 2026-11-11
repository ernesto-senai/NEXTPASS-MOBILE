import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Aviso } from "@/components/ui/aviso";
import { BarraProgresso } from "@/components/ui/barra-progresso";
import { Botao } from "@/components/ui/botao";
import { Carregando } from "@/components/ui/carregando";
import { MensagemErro, MensagemSucesso } from "@/components/ui/mensagem-erro";
import { TelaRolavel } from "@/components/ui/tela-rolavel";
import { usePerfil } from "@/features/perfil/hooks";
import { LIMITES_DOCUMENTO } from "@/features/verificacao/api";
import { SeletorDocumento } from "@/features/verificacao/components/seletor-documento";
import { useEnviarDocumentos, useVerificacao } from "@/features/verificacao/hooks";
import { useLayoutResponsivo } from "@/hooks/use-layout-responsivo";
import { type ArquivoEscolhido, escolherDocumento } from "@/lib/arquivos";
import { mensagemDeErro } from "@/services/api/client";
import { cores, espacamento, fonte } from "@/theme";

// Motivo para recusar o arquivo antes do envio, ou null se ele pode ir.
function problemaDoArquivo({ tipo, tamanhoBytes }: ArquivoEscolhido) {
  const { formatos, tamanhoMaxMb } = LIMITES_DOCUMENTO;
  if (!(formatos as readonly string[]).includes(tipo)) return "Escolha um arquivo JPG, PNG ou PDF.";
  if (tamanhoBytes && tamanhoBytes > tamanhoMaxMb * 1024 * 1024) {
    return `O arquivo pode ter até ${tamanhoMaxMb} MB.`;
  }
  return null;
}

// Envio de documentos e status da verificação (RF-16, RF-17, RN-04)
export default function Verificacao() {
  const { compacto } = useLayoutResponsivo();
  const verificacao = useVerificacao();
  const perfil = usePerfil();

  if (!verificacao.data) {
    return <Carregando erro={verificacao.error} onTentarDeNovo={() => verificacao.refetch()} />;
  }
  const { verificado, status, motivoRecusa } = verificacao.data;
  const porClube = perfil.data?.olheiro?.atuacao === "CLUBE";

  return (
    <TelaRolavel>
      <View style={styles.cabecalho}>
        <Text
          style={[styles.titulo, { fontSize: compacto ? fonte.tituloCompacto : fonte.titulo }]}
          accessibilityRole="header"
        >
          Verificação da conta
        </Text>
        <Text style={styles.dica}>
          Para proteger os atletas, o feed de lances, a busca, as avaliações e os convites são
          liberados depois que a equipe do NextPass confere seus documentos.
        </Text>
      </View>

      {verificado ? (
        <MensagemSucesso mensagem="Sua conta está verificada. Todas as funções de olheiro estão liberadas." />
      ) : null}

      {!verificado && status === "PENDENTE" ? (
        <Aviso
          icone="time-outline"
          titulo="Documentos em análise"
          texto="Você recebe um aviso aqui no app assim que a equipe terminar a análise."
        />
      ) : null}

      {!verificado && status === "RECUSADA" ? (
        <MensagemErro
          mensagem={`Seus documentos foram recusados${motivoRecusa ? `: ${motivoRecusa}` : "."} Envie novamente abaixo.`}
        />
      ) : null}

      {!verificado && status !== "PENDENTE" ? <EnvioDeDocumentos porClube={porClube} /> : null}
    </TelaRolavel>
  );
}

function EnvioDeDocumentos({ porClube }: { porClube: boolean }) {
  const enviar = useEnviarDocumentos();
  const [documento, setDocumento] = useState<ArquivoEscolhido | null>(null);
  const [comprovante, setComprovante] = useState<ArquivoEscolhido | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  async function escolher(definir: (arquivo: ArquivoEscolhido) => void) {
    setErro(null);
    const arquivo = await escolherDocumento();
    if (!arquivo) return;
    const problema = problemaDoArquivo(arquivo);
    if (problema) setErro(problema);
    else definir(arquivo);
  }

  function enviarDocumentos() {
    if (!documento) return setErro("Escolha o documento com foto.");
    if (porClube && !comprovante) return setErro("Escolha o comprovante de vínculo com o clube.");
    setErro(null);
    enviar.mutate({ documento, comprovante });
  }

  return (
    <>
      <SeletorDocumento
        rotulo="Documento com foto (RG ou CNH)"
        arquivo={documento}
        desativado={enviar.isPending}
        onEscolher={() => escolher(setDocumento)}
      />
      {/* RN-05: o clube só aparece nas avaliações depois do vínculo comprovado. */}
      {porClube ? (
        <SeletorDocumento
          rotulo="Comprovante de vínculo com o clube"
          arquivo={comprovante}
          desativado={enviar.isPending}
          onEscolher={() => escolher(setComprovante)}
        />
      ) : null}
      <Text style={styles.dica}>
        Os arquivos ficam guardados com acesso restrito e só a equipe do NextPass os vê.
      </Text>

      {erro || enviar.error ? (
        <MensagemErro mensagem={erro ?? mensagemDeErro(enviar.error)} />
      ) : null}
      {enviar.isPending ? (
        <BarraProgresso
          atual={enviar.progresso}
          total={1}
          rotuloAcessivel={`Enviando documentos: ${Math.round(enviar.progresso * 100)}%`}
        />
      ) : null}

      <Botao
        titulo="Enviar documentos"
        iconeInicio="shield-checkmark-outline"
        carregando={enviar.isPending}
        onPress={enviarDocumentos}
      />
    </>
  );
}

const styles = StyleSheet.create({
  cabecalho: {
    gap: espacamento.xs,
  },
  titulo: {
    color: cores.texto,
    fontWeight: "800",
  },
  dica: {
    color: cores.textoSecundario,
    fontSize: fonte.apoio,
    lineHeight: 20,
  },
});
