import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { cores, espacamento } from "@/theme";

interface TelaProps {
  titulo: string;
  children?: ReactNode;
}

// Contêiner padrão das telas: fundo escuro, área segura e título.
export function Tela({ titulo, children }: TelaProps) {
  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <Text style={styles.titulo}>{titulo}</Text>
      <View style={styles.conteudo}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo,
    paddingHorizontal: espacamento.md,
  },
  titulo: {
    color: cores.texto,
    fontSize: 24,
    fontWeight: "700",
    marginVertical: espacamento.md,
  },
  conteudo: {
    flex: 1,
  },
});
