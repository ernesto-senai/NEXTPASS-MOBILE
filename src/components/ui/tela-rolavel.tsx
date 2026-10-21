import type { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLayoutResponsivo } from "@/hooks/use-layout-responsivo";
import { cores, espacamento, larguraMaximaConteudo } from "@/theme";

// Base das telas abertas por cima das abas (detalhes, perfis, formulários): o
// cabeçalho com "voltar" fica em cima, o conteúdo rola na vertical, acompanha
// o teclado e, em telas largas, fica numa coluna de até 640px.
export function TelaRolavel({ children }: { children: ReactNode }) {
  const { margemLateral, espacoEntreCampos } = useLayoutResponsivo();

  return (
    <SafeAreaView style={styles.tela} edges={["left", "right", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.tela}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.conteudo,
            { paddingHorizontal: margemLateral, gap: espacoEntreCampos },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  conteudo: {
    width: "100%",
    maxWidth: larguraMaximaConteudo,
    alignSelf: "center",
    paddingTop: espacamento.sm,
    paddingBottom: espacamento.xl,
  },
});
