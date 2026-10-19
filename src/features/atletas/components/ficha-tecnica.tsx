import { StyleSheet, Text, View } from "react-native";
import { cores, espacamento, fonte, raio } from "@/theme";

interface ItemFicha {
  rotulo: string;
  valor: string;
}

// Ficha técnica em blocos (Categoria, Altura, Pé), como no protótipo. Os
// blocos quebram linha em telas estreitas.
export function FichaTecnica({ itens }: { itens: ItemFicha[] }) {
  return (
    <View style={styles.dados}>
      {itens.map(({ rotulo, valor }) => (
        <View key={rotulo} style={styles.dado}>
          <Text style={styles.rotulo}>{rotulo}</Text>
          <Text style={styles.valor} numberOfLines={1}>
            {valor}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  dados: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: espacamento.sm,
  },
  dado: {
    flexGrow: 1,
    flexBasis: 80,
    alignItems: "center",
    paddingVertical: espacamento.sm,
    borderRadius: raio.sm,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  rotulo: {
    color: cores.textoSecundario,
    fontSize: fonte.rotulo,
  },
  valor: {
    color: cores.primaria,
    fontSize: fonte.apoio + 1,
    fontWeight: "700",
  },
});
