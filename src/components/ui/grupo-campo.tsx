import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { cores, fonte } from "@/theme";

// Rótulo verde em caixa alta sobre um grupo de opções (chips, seletores),
// no mesmo estilo do rótulo do CampoTexto.
export function GrupoCampo({ rotulo, children }: { rotulo: string; children: ReactNode }) {
  return (
    <View>
      <Text style={styles.rotulo} accessibilityRole="header">
        {rotulo}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  rotulo: {
    color: cores.primaria,
    fontSize: fonte.rotulo,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 6,
  },
});
