import { StyleSheet, Text, View } from "react-native";
import { POSICOES, rotuloDe } from "@/lib/rotulos";
import { cores, fonte, raio } from "@/theme";
import type { Posicao } from "@/types/api";

// Lugar de cada posição no campo deitado, atacando para a direita (em % da
// largura e da altura).
const LUGARES: Record<Posicao, { x: number; y: number }> = {
  GOL: { x: 6, y: 50 },
  ZAG: { x: 22, y: 50 },
  LE: { x: 28, y: 15 },
  LD: { x: 28, y: 85 },
  VOL: { x: 42, y: 50 },
  MEI: { x: 58, y: 50 },
  PE: { x: 75, y: 15 },
  PD: { x: 75, y: 85 },
  ATA: { x: 85, y: 50 },
};

const LINHA = "rgba(255, 255, 255, 0.25)";

// RF-38: mapa de posições do protótipo. Só as posições do atleta aparecem,
// em verde, com a sigla; o leitor de tela lê a lista por extenso.
export function MapaDePosicoes({ posicoes }: { posicoes: Posicao[] }) {
  const nomes = posicoes.map((posicao) => rotuloDe(POSICOES, posicao)).join(", ");

  return (
    <View style={styles.campo} accessible accessibilityLabel={`Posições no campo: ${nomes}`}>
      <View style={styles.meioCampo} />
      <View style={styles.circulo} />
      <View style={[styles.area, styles.areaEsquerda]} />
      <View style={[styles.area, styles.areaDireita]} />

      {posicoes.map((posicao) => {
        const { x, y } = LUGARES[posicao];
        return (
          <View key={posicao} style={[styles.marcador, { left: `${x}%`, top: `${y}%` }]}>
            <Text style={styles.sigla}>{posicao}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  campo: {
    width: "100%",
    aspectRatio: 16 / 9,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: LINHA,
    borderRadius: raio.md,
    backgroundColor: "#173A1F",
  },
  meioCampo: {
    position: "absolute",
    left: "50%",
    top: 0,
    bottom: 0,
    width: 2,
    marginLeft: -1,
    backgroundColor: LINHA,
  },
  circulo: {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: "22%",
    aspectRatio: 1,
    borderWidth: 2,
    borderColor: LINHA,
    borderRadius: 999,
    transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
  },
  area: {
    position: "absolute",
    top: "25%",
    bottom: "25%",
    width: "14%",
    borderWidth: 2,
    borderColor: LINHA,
  },
  areaEsquerda: {
    left: -2,
  },
  areaDireita: {
    right: -2,
  },
  // Centralizado no ponto da posição.
  marcador: {
    position: "absolute",
    minWidth: 40,
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: cores.primaria,
    transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
  },
  sigla: {
    color: cores.texto,
    fontSize: fonte.rotulo,
    fontWeight: "800",
  },
});
