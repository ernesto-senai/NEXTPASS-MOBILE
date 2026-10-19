import { Ionicons } from "@expo/vector-icons";
import { useVideoPlayer, VideoView } from "expo-video";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinkTexto } from "@/components/ui/link-texto";
import { useLayoutResponsivo } from "@/hooks/use-layout-responsivo";
import { formatarMegabytes } from "@/lib/formatadores";
import { cores, espacamento, fonte, raio } from "@/theme";
import { LIMITES_LANCE, type VideoEscolhido } from "../video";

interface SeletorVideoProps {
  video: VideoEscolhido | null;
  onEscolher: () => void;
  // Durante o envio, o vídeo não pode ser trocado.
  desativado?: boolean;
}

// Cada trecho fica numa linha só (espaço não separável) para "50 MB" não quebrar.
const DICA = [
  "MP4 ou MOV",
  `${LIMITES_LANCE.duracaoMinSeg} a ${LIMITES_LANCE.duracaoMaxSeg} segundos`,
  `até ${LIMITES_LANCE.tamanhoMaxMb} MB`,
]
  .map((trecho) => trecho.replaceAll(" ", " "))
  .join(" · ");

// Área "Adicionar" do protótipo: sem vídeo, convida a escolher um na galeria;
// com vídeo, mostra a prévia, a duração, o tamanho e o atalho para trocar.
export function SeletorVideo({ video, onEscolher, desativado = false }: SeletorVideoProps) {
  const { compacto } = useLayoutResponsivo();
  const altura = compacto ? 180 : 220;

  if (!video) {
    return (
      <Pressable
        onPress={onEscolher}
        disabled={desativado}
        accessibilityRole="button"
        accessibilityLabel="Escolher vídeo do lance"
        accessibilityHint={DICA}
        style={({ pressed }) => [
          styles.vazio,
          { minHeight: altura },
          pressed && styles.pressionado,
        ]}
      >
        <Ionicons name="videocam-outline" size={36} color={cores.primaria} />
        <Text style={styles.chamada}>Escolher vídeo da galeria</Text>
        <Text style={styles.dica}>{DICA}</Text>
      </Pressable>
    );
  }

  return (
    <View>
      <PreviaVideo key={video.uri} uri={video.uri} altura={altura} />
      <View style={styles.rodape}>
        <Text style={styles.detalhes} numberOfLines={1}>
          {detalhesDoVideo(video)}
        </Text>
        {desativado ? null : <LinkTexto onPress={onEscolher}>Trocar vídeo</LinkTexto>}
      </View>
    </View>
  );
}

function PreviaVideo({ uri, altura }: { uri: string; altura: number }) {
  const player = useVideoPlayer(uri);

  return (
    <VideoView
      player={player}
      nativeControls
      contentFit="contain"
      style={[styles.previa, { height: altura }]}
      accessibilityLabel="Prévia do vídeo escolhido"
    />
  );
}

// "45 s · 12,3 MB"; sem esses dados (alguns aparelhos não informam), o nome.
function detalhesDoVideo({ nome, duracaoSeg, tamanhoBytes }: VideoEscolhido) {
  const partes = [
    duracaoSeg ? `${Math.round(duracaoSeg)} s` : null,
    tamanhoBytes ? formatarMegabytes(tamanhoBytes) : null,
  ].filter(Boolean);
  return partes.length > 0 ? partes.join(" · ") : nome;
}

const styles = StyleSheet.create({
  vazio: {
    alignItems: "center",
    justifyContent: "center",
    gap: espacamento.sm,
    padding: espacamento.md,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: cores.borda,
    borderRadius: raio.md,
    backgroundColor: cores.fundoCampo,
  },
  pressionado: {
    opacity: 0.85,
  },
  chamada: {
    color: cores.texto,
    fontSize: fonte.corpo,
    fontWeight: "700",
    textAlign: "center",
  },
  dica: {
    color: cores.textoSecundario,
    fontSize: fonte.apoio,
    textAlign: "center",
  },
  previa: {
    width: "100%",
    borderRadius: raio.md,
    overflow: "hidden",
    backgroundColor: cores.superficie,
  },
  rodape: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: espacamento.sm,
  },
  detalhes: {
    flexShrink: 1,
    color: cores.textoSecundario,
    fontSize: fonte.apoio,
  },
});
