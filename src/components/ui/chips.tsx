import { Pressable, StyleSheet, Text, View } from "react-native";
import { areaToqueMinima, cores, espacamento, fonte } from "@/theme";

interface ChipsProps<T extends string> {
  rotuloAcessivel: string;
  opcoes: readonly { valor: T; rotulo: string }[];
  selecionados: readonly T[];
  onAlternar: (valor: T) => void;
}

// Opções em "pílulas" que quebram linha em telas estreitas. Quem usa decide se
// a escolha é única ou múltipla em onAlternar.
export function Chips<T extends string>({
  rotuloAcessivel,
  opcoes,
  selecionados,
  onAlternar,
}: ChipsProps<T>) {
  return (
    <View accessibilityLabel={rotuloAcessivel} style={styles.grupo}>
      {opcoes.map(({ valor, rotulo }) => {
        const ativo = selecionados.includes(valor);
        return (
          <Pressable
            key={valor}
            onPress={() => onAlternar(valor)}
            accessibilityRole="checkbox"
            aria-checked={ativo}
            style={[styles.chip, ativo && styles.chipAtivo]}
          >
            <Text style={[styles.texto, ativo && styles.textoAtivo]}>{rotulo}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grupo: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: espacamento.sm,
  },
  chip: {
    minHeight: areaToqueMinima,
    justifyContent: "center",
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: cores.bordaCampo,
    borderRadius: 999,
    backgroundColor: cores.fundoCampo,
  },
  chipAtivo: {
    borderColor: cores.primaria,
    backgroundColor: cores.primariaEscura,
  },
  texto: {
    color: cores.textoSecundario,
    fontSize: fonte.apoio + 1,
    fontWeight: "600",
  },
  textoAtivo: {
    color: cores.texto,
  },
});
