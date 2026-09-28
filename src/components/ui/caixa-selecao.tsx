import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { areaToqueMinima, cores, espacamento, fonte, raio } from "@/theme";

interface CaixaSelecaoProps {
  rotulo: string;
  marcada: boolean;
  onAlternar: () => void;
  erro?: string | undefined;
}

// Caixa de seleção em que a linha inteira é tocável (mínimo de 44 pt).
export function CaixaSelecao({ rotulo, marcada, onAlternar, erro }: CaixaSelecaoProps) {
  return (
    <View>
      <Pressable
        onPress={onAlternar}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: marcada }}
        accessibilityLabel={rotulo}
        style={styles.linha}
      >
        <View style={[styles.quadrado, marcada && styles.quadradoMarcado]}>
          {marcada ? <Ionicons name="checkmark" size={18} color={cores.fundo} /> : null}
        </View>
        <Text style={styles.rotulo}>{rotulo}</Text>
      </Pressable>
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  linha: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacamento.sm + 2,
    minHeight: areaToqueMinima,
  },
  quadrado: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: cores.primaria,
    borderRadius: raio.sm - 2,
  },
  quadradoMarcado: {
    backgroundColor: cores.primaria,
  },
  rotulo: {
    flexShrink: 1,
    color: cores.texto,
    fontSize: fonte.apoio + 1,
  },
  erro: {
    color: cores.erro,
    fontSize: fonte.apoio,
  },
});
