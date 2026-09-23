import { Pressable, StyleSheet, Text } from "react-native";
import { areaToqueMinima, cores, espacamento, fonte } from "@/theme";

interface LinkTextoProps {
  children: string;
  onPress: () => void;
}

// Link de texto com área de toque de pelo menos 44 pt (RNF-14), mesmo que o
// texto seja pequeno.
export function LinkTexto({ children, onPress }: LinkTextoProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="link"
      style={({ pressed }) => [styles.alvo, pressed && styles.pressionado]}
    >
      <Text style={styles.texto}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  alvo: {
    minHeight: areaToqueMinima,
    justifyContent: "center",
    paddingHorizontal: espacamento.xs,
  },
  pressionado: {
    opacity: 0.7,
  },
  texto: {
    color: cores.primaria,
    fontSize: fonte.apoio + 1,
    fontWeight: "600",
  },
});
