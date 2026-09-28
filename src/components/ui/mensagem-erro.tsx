import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { cores, espacamento, fonte, raio } from "@/theme";

// Aviso de erro geral do formulário (ex.: senha incorreta, sem conexão).
export function MensagemErro({ mensagem }: { mensagem: string }) {
  return (
    <View style={styles.caixa} accessibilityRole="alert" accessibilityLiveRegion="assertive">
      <Ionicons name="alert-circle" size={20} color={cores.erro} />
      <Text style={styles.texto}>{mensagem}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  caixa: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacamento.sm,
    padding: 12,
    borderWidth: 1,
    borderColor: cores.erro,
    borderRadius: raio.md,
    backgroundColor: "rgba(229, 72, 77, 0.12)",
  },
  texto: {
    flexShrink: 1,
    color: cores.texto,
    fontSize: fonte.apoio + 1,
  },
});
