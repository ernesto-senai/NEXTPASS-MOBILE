import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { somenteDigitos } from "@/lib/formatadores";
import { areaToqueMinima, alturaCampo, cores, fonte, raio } from "@/theme";

interface ContadorProps {
  rotulo: string;
  valor: number;
  min: number;
  max: number;
  onAlterar: (valor: number) => void;
}

// "Limite de vagas" do protótipo: − 30 +. Os botões têm 44 pt (RNF-14) e o
// número também pode ser digitado, para não precisar tocar 100 vezes.
export function Contador({ rotulo, valor, min, max, onAlterar }: ContadorProps) {
  const botao = (icone: "remove" | "add", acao: string, novo: number, ativo: boolean) => (
    <Pressable
      onPress={() => onAlterar(novo)}
      disabled={!ativo}
      accessibilityRole="button"
      accessibilityLabel={`${acao} ${rotulo.toLowerCase()}`}
      aria-disabled={!ativo}
      style={({ pressed }) => [
        styles.botao,
        pressed && styles.pressionado,
        !ativo && styles.inativo,
      ]}
    >
      <Ionicons name={icone} size={22} color={cores.primaria} />
    </Pressable>
  );

  return (
    <View style={styles.linha}>
      {botao("remove", "Diminuir", valor - 1, valor > min)}
      <TextInput
        value={valor ? String(valor) : ""}
        onChangeText={(texto) => onAlterar(Math.min(Number(somenteDigitos(texto)), max))}
        keyboardType="number-pad"
        maxLength={String(max).length}
        accessibilityLabel={rotulo}
        style={styles.valor}
      />
      {botao("add", "Aumentar", valor + 1, valor < max)}
    </View>
  );
}

const styles = StyleSheet.create({
  linha: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: alturaCampo,
    borderWidth: 1,
    borderColor: cores.bordaCampo,
    borderRadius: raio.md,
    backgroundColor: cores.fundoCampo,
  },
  botao: {
    width: areaToqueMinima + 4,
    height: alturaCampo - 2,
    alignItems: "center",
    justifyContent: "center",
  },
  pressionado: {
    opacity: 0.7,
  },
  inativo: {
    opacity: 0.35,
  },
  // Ocupa a altura toda da linha: tocar em qualquer ponto do meio edita o número.
  valor: {
    flex: 1,
    minWidth: 0,
    alignSelf: "stretch",
    color: cores.texto,
    fontSize: fonte.input,
    fontWeight: "700",
    textAlign: "center",
  },
});
