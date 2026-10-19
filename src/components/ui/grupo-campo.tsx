import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { cores, espacamento, fonte } from "@/theme";

interface GrupoCampoProps {
  rotulo: string;
  children: ReactNode;
  // Mensagem de validação abaixo do grupo, como a do CampoTexto.
  erro?: string | undefined;
}

// Rótulo verde em caixa alta sobre um grupo de opções (chips, seletores),
// no mesmo estilo do rótulo do CampoTexto.
export function GrupoCampo({ rotulo, children, erro }: GrupoCampoProps) {
  return (
    <View>
      <Text style={styles.rotulo} accessibilityRole="header">
        {rotulo}
      </Text>
      {children}
      {erro ? (
        <Text style={styles.erro} accessibilityLiveRegion="polite">
          {erro}
        </Text>
      ) : null}
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
  erro: {
    color: cores.erro,
    fontSize: fonte.apoio,
    marginTop: espacamento.xs,
  },
});
