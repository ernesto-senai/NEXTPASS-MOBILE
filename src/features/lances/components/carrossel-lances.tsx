import { useVideoPlayer, VideoView } from "expo-video";
import { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Etiqueta } from "@/components/ui/etiqueta";
import { formatarData, formatarDuracao } from "@/lib/formatadores";
import { urlDoArquivo } from "@/services/api/client";
import { cores, espacamento, fonte, raio } from "@/theme";
import type { LanceDoAtleta } from "../api";

interface CarrosselLancesProps {
  lances: LanceDoAtleta[];
  // Largura útil da tela: cada lance ocupa uma "página" do carrossel.
  largura: number;
}

// RF-28: lances em destaque, um por vez, com os pontos de posição do protótipo.
export function CarrosselLances({ lances, largura }: CarrosselLancesProps) {
  const [atual, setAtual] = useState(0);

  return (
    <View style={styles.carrossel}>
      <FlatList
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={lances}
        keyExtractor={(lance) => lance.id}
        renderItem={({ item }) => <SlideLance lance={item} largura={largura} />}
        onScroll={(evento) => setAtual(Math.round(evento.nativeEvent.contentOffset.x / largura))}
        scrollEventThrottle={16}
        style={{ width: largura }}
      />
      {lances.length > 1 ? (
        <View style={styles.pontos} accessibilityLabel={`Lance ${atual + 1} de ${lances.length}`}>
          {lances.map((lance, indice) => (
            <View key={lance.id} style={[styles.ponto, indice === atual && styles.pontoAtual]} />
          ))}
        </View>
      ) : null}
    </View>
  );
}

function SlideLance({ lance, largura }: { lance: LanceDoAtleta; largura: number }) {
  const player = useVideoPlayer(urlDoArquivo(lance.url));

  return (
    <View style={[styles.slide, { width: largura }]}>
      <View>
        <VideoView
          player={player}
          nativeControls
          contentFit="cover"
          style={styles.video}
          accessibilityLabel={lance.legenda ?? "Lance em destaque"}
        />
        <View style={styles.duracao} pointerEvents="none">
          <Etiqueta texto={formatarDuracao(lance.duracaoSeg)} tom="sobreImagem" />
        </View>
      </View>
      <View style={styles.legenda}>
        <Text style={styles.titulo} numberOfLines={1}>
          {lance.legenda ?? "Lance sem legenda"}
        </Text>
        <Text style={styles.data}>{formatarData(lance.criadoEm)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  carrossel: {
    gap: espacamento.sm,
  },
  slide: {
    overflow: "hidden",
    borderRadius: raio.md,
    backgroundColor: cores.superficie,
  },
  video: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: cores.fundoCampo,
  },
  duracao: {
    position: "absolute",
    top: espacamento.sm,
    left: espacamento.sm,
  },
  legenda: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: espacamento.sm,
    padding: 12,
  },
  titulo: {
    flex: 1,
    color: cores.texto,
    fontSize: fonte.apoio + 1,
    fontWeight: "700",
  },
  data: {
    color: cores.textoSecundario,
    fontSize: fonte.rotulo,
  },
  pontos: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  ponto: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: cores.bordaCampo,
  },
  pontoAtual: {
    width: 20,
    backgroundColor: cores.primaria,
  },
});
