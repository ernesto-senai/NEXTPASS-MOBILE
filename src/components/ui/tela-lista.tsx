import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { cores, larguraMaximaConteudo } from "@/theme";

interface TelaListaProps {
  children: ReactNode;
  // Telas sem o menu inferior (ex.: modais) também respeitam a borda de baixo.
  comBordaInferior?: boolean;
}

// Base das telas de lista (feeds e pesquisas): fundo escuro, área segura e, em
// tablets e no navegador, uma coluna centralizada de até 640px.
export function TelaLista({ children, comBordaInferior = false }: TelaListaProps) {
  return (
    <SafeAreaView
      style={styles.tela}
      edges={comBordaInferior ? ["top", "left", "right", "bottom"] : ["top", "left", "right"]}
    >
      <View style={styles.coluna}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  coluna: {
    flex: 1,
    width: "100%",
    maxWidth: larguraMaximaConteudo,
    alignSelf: "center",
  },
});
