import type { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLayoutResponsivo } from "@/hooks/use-layout-responsivo";
import { cores, espacamento, larguraMaximaFormulario, raio } from "@/theme";

interface TelaFormularioProps {
  children: ReactNode;
}

// Base das telas de login e cadastro: rola na vertical, sobe com o teclado e,
// em telas largas, mostra o formulário num cartão no meio.
export function TelaFormulario({ children }: TelaFormularioProps) {
  const { largo, margemLateral } = useLayoutResponsivo();

  return (
    <SafeAreaView style={styles.tela}>
      <KeyboardAvoidingView
        style={styles.tela}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={[styles.conteudo, { paddingHorizontal: margemLateral }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.formulario, largo && styles.cartao]}>{children}</View>
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
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: espacamento.lg,
  },
  formulario: {
    width: "100%",
    maxWidth: larguraMaximaFormulario,
    alignSelf: "center",
  },
  cartao: {
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: raio.lg,
    padding: espacamento.xl,
  },
});
