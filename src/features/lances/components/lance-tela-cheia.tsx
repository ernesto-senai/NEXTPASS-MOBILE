import { Ionicons } from "@expo/vector-icons";
import { useEvent } from "expo";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Avatar } from "@/components/ui/avatar";
import { Botao } from "@/components/ui/botao";
import { Etiqueta } from "@/components/ui/etiqueta";
import { useLayoutResponsivo } from "@/hooks/use-layout-responsivo";
import { formatarVisualizacoes } from "@/lib/formatadores";
import { cores, espacamento, fonte } from "@/theme";
import type { LanceDoFeed } from "../api";

interface LanceTelaCheiaProps {
  lance: LanceDoFeed;
  altura: number;
  // Só o lance visível toca; os outros ficam pausados.
  ativo: boolean;
}

// Um lance do feed do olheiro ocupando a tela (RF-32 a RF-34). Começa sem som;
// tocar no vídeo liga e desliga o som.
export function LanceTelaCheia({ lance, altura, ativo }: LanceTelaCheiaProps) {
  const router = useRouter();
  const topo = useSafeAreaInsets().top;
  const { compacto, margemLateral } = useLayoutResponsivo();
  const [mudo, setMudo] = useState(true);

  const player = useVideoPlayer(lance.url, (p) => {
    p.loop = true;
    p.muted = true;
  });

  // No navegador, play() antes de o vídeo carregar é ignorado; por isso o
  // efeito roda de novo quando o status muda (ex.: para "readyToPlay").
  const { status } = useEvent(player, "statusChange", { status: player.status });

  useEffect(() => {
    if (ativo) player.play();
    else player.pause();
  }, [ativo, player, status]);

  // O expo-video liga e desliga o som pela propriedade `muted` do player.
  const alternarSom = () => {
    const novoMudo = !mudo;
    // eslint-disable-next-line react-hooks/immutability -- é a API do expo-video
    player.muted = novoMudo;
    setMudo(novoMudo);
  };

  return (
    <View style={[styles.lance, { height: altura }]}>
      <VideoView
        player={player}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        nativeControls={false}
      />
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={alternarSom}
        accessibilityRole="button"
        accessibilityLabel={mudo ? "Ativar o som do lance" : "Desativar o som do lance"}
      />

      <View style={[styles.topo, { top: topo + espacamento.sm, paddingHorizontal: margemLateral }]}>
        <Etiqueta
          icone="eye-outline"
          texto={formatarVisualizacoes(lance.visualizacoes)}
          tom="sobreImagem"
        />
        <View style={styles.som}>
          <Ionicons name={mudo ? "volume-mute" : "volume-high"} size={18} color={cores.texto} />
        </View>
      </View>

      <LinearGradient
        colors={["transparent", "rgba(0, 0, 0, 0.9)"]}
        style={[styles.rodape, { paddingHorizontal: margemLateral }]}
      >
        <View style={styles.autor}>
          <Avatar nome={lance.atleta.nome} fotoUrl={lance.atleta.fotoUrl} tamanho={44} />
          <View style={styles.textos}>
            <Text style={styles.nome} numberOfLines={1}>
              {lance.atleta.nome}
            </Text>
            {lance.legenda ? (
              <Text style={styles.legenda} numberOfLines={compacto ? 2 : 3}>
                {lance.legenda}
              </Text>
            ) : null}
          </View>
        </View>
        <Botao
          titulo="Chamar para Avaliação"
          iconeInicio="paper-plane-outline"
          onPress={() =>
            router.push({
              pathname: "/olheiro/convidar/[atletaId]",
              params: { atletaId: lance.atleta.id },
            })
          }
        />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  lance: {
    width: "100%",
    overflow: "hidden",
    backgroundColor: cores.fundo,
  },
  // Camadas sobre o vídeo deixam o toque passar para o botão de som, exceto
  // no botão "Chamar para Avaliação".
  topo: {
    position: "absolute",
    left: 0,
    right: 0,
    pointerEvents: "none",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  som: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  rodape: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: "box-none",
    gap: 12,
    paddingTop: espacamento.xl * 2,
    paddingBottom: espacamento.md,
  },
  autor: {
    pointerEvents: "none",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  textos: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  nome: {
    color: cores.texto,
    fontSize: fonte.corpo + 1,
    fontWeight: "800",
  },
  legenda: {
    color: cores.texto,
    fontSize: fonte.apoio,
    lineHeight: 19,
  },
});
