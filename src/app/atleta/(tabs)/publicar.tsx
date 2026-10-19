import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { BarraProgresso } from "@/components/ui/barra-progresso";
import { Botao } from "@/components/ui/botao";
import { CampoTexto } from "@/components/ui/campo-texto";
import { MensagemErro, MensagemSucesso } from "@/components/ui/mensagem-erro";
import { TelaLista } from "@/components/ui/tela-lista";
import { TituloTela } from "@/components/ui/titulo-tela";
import { SeletorVideo } from "@/features/lances/components/seletor-video";
import { usePublicarLance } from "@/features/lances/hooks";
import { escolherVideo, problemaDoVideo, type VideoEscolhido } from "@/features/lances/video";
import { useLayoutResponsivo } from "@/hooks/use-layout-responsivo";
import { mensagemDeErro } from "@/services/api/client";
import { cores, espacamento, fonte } from "@/theme";

// Publicar lance de 30 a 60 segundos com legenda e localização (RF-25, RN-09)
export default function PublicarLance() {
  const { margemLateral, espacoEntreCampos } = useLayoutResponsivo();
  const [video, setVideo] = useState<VideoEscolhido | null>(null);
  const [legenda, setLegenda] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [problema, setProblema] = useState<string | null>(null);
  const publicacao = usePublicarLance();
  const enviando = publicacao.isPending;
  const porcentagem = Math.round(publicacao.progresso * 100);

  async function escolher() {
    let escolhido: VideoEscolhido | null;
    try {
      escolhido = await escolherVideo();
    } catch {
      // Na web dá para escolher qualquer arquivo, mas a galeria só lê vídeos.
      publicacao.reset();
      setProblema("Não foi possível abrir este arquivo. Escolha um vídeo MP4 ou MOV.");
      return;
    }
    if (!escolhido) return;
    publicacao.reset();
    const motivo = problemaDoVideo(escolhido);
    setProblema(motivo);
    setVideo(motivo ? null : escolhido);
  }

  function publicar() {
    if (!video) return;
    publicacao.mutate(
      { video, legenda, localizacao },
      {
        onSuccess: () => {
          setVideo(null);
          setLegenda("");
          setLocalizacao("");
        },
      },
    );
  }

  return (
    <TelaLista>
      <TituloTela>Adicionar lance</TituloTela>

      <ScrollView
        contentContainerStyle={[
          styles.conteudo,
          { paddingHorizontal: margemLateral, gap: espacoEntreCampos },
        ]}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
      >
        <SeletorVideo video={video} onEscolher={escolher} desativado={enviando} />
        {problema ? <MensagemErro mensagem={problema} /> : null}

        <CampoTexto
          rotulo="Legenda"
          placeholder="Ex.: Drible e finalização na final do campeonato"
          value={legenda}
          onChangeText={setLegenda}
          multiline
          maxLength={200}
          editable={!enviando}
        />
        <CampoTexto
          rotulo="Localização"
          icone="location-outline"
          placeholder="Ex.: São Paulo - SP"
          value={localizacao}
          onChangeText={setLocalizacao}
          maxLength={100}
          autoCapitalize="words"
          editable={!enviando}
        />

        {/* RNF-05: progresso do envio e mensagem de sucesso ou erro. */}
        {enviando ? (
          <View style={styles.envio}>
            <BarraProgresso atual={porcentagem} total={100} rotuloAcessivel="Envio do lance" />
            <Text style={styles.textoEnvio} accessibilityLiveRegion="polite">
              {porcentagem < 100 ? `Enviando… ${porcentagem}%` : "Finalizando…"}
            </Text>
          </View>
        ) : null}
        {publicacao.isError ? <MensagemErro mensagem={mensagemDeErro(publicacao.error)} /> : null}
        {publicacao.isSuccess ? (
          <MensagemSucesso mensagem="Lance publicado! Os olheiros já podem assistir." />
        ) : null}

        <Botao titulo="Publicar" onPress={publicar} carregando={enviando} desativado={!video} />
      </ScrollView>
    </TelaLista>
  );
}

const styles = StyleSheet.create({
  conteudo: {
    paddingTop: espacamento.md,
    paddingBottom: espacamento.lg,
  },
  envio: {
    gap: espacamento.xs,
  },
  textoEnvio: {
    color: cores.textoSecundario,
    fontSize: fonte.apoio,
  },
});
