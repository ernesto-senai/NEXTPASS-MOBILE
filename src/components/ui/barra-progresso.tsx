import { StyleSheet, View } from "react-native";
import { cores } from "@/theme";

interface BarraProgressoProps {
  atual: number;
  total: number;
  rotuloAcessivel: string;
}

// Barra de preenchimento, como a de vagas ocupadas no card da avaliação.
export function BarraProgresso({ atual, total, rotuloAcessivel }: BarraProgressoProps) {
  const proporcao = total > 0 ? Math.min(atual / total, 1) : 0;

  return (
    <View
      style={styles.trilho}
      accessibilityRole="progressbar"
      accessibilityLabel={rotuloAcessivel}
      accessibilityValue={{ min: 0, max: total, now: atual }}
    >
      <View style={[styles.preenchimento, { width: `${proporcao * 100}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  trilho: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
  },
  preenchimento: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: cores.primaria,
  },
});
