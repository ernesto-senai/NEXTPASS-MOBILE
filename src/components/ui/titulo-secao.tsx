import { StyleSheet, Text, View } from "react-native";
import { cores, espacamento, fonte } from "@/theme";

// Título de seção com a barra verde do protótipo ("Lances em destaque").
export function TituloSecao({ children }: { children: string }) {
  return (
    <View style={styles.linha}>
      <View style={styles.barra} />
      <Text style={styles.titulo} accessibilityRole="header">
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  linha: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacamento.sm,
  },
  barra: {
    width: 4,
    height: 20,
    borderRadius: 2,
    backgroundColor: cores.primaria,
  },
  titulo: {
    color: cores.texto,
    fontSize: fonte.corpo + 1,
    fontWeight: "700",
  },
});
