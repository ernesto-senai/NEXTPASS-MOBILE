import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps, ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { cores, espacamento, fonte } from "@/theme";

interface LinhaInfoProps {
  icone: ComponentProps<typeof Ionicons>["name"];
  titulo: string;
  children: ReactNode;
  // Observação em letra menor (ex.: "o pagamento é feito fora do app").
  nota?: string | undefined;
}

// Linha da ficha da avaliação (protótipo "Peneira"): ícone, título e valor,
// separadas por uma linha fina.
export function LinhaInfo({ icone, titulo, children, nota }: LinhaInfoProps) {
  return (
    <View style={styles.linha}>
      <Ionicons name={icone} size={24} color={cores.primaria} style={styles.icone} />
      <View style={styles.textos}>
        <Text style={styles.titulo}>{titulo}</Text>
        <Text style={styles.valor}>{children}</Text>
        {nota ? <Text style={styles.nota}>{nota}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  linha: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: cores.bordaCampo,
  },
  icone: {
    marginTop: 2,
  },
  textos: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  titulo: {
    color: cores.texto,
    fontSize: fonte.apoio + 1,
    fontWeight: "700",
  },
  valor: {
    color: cores.texto,
    fontSize: fonte.apoio,
    lineHeight: 20,
  },
  nota: {
    color: cores.textoSecundario,
    fontSize: fonte.rotulo,
    marginTop: espacamento.xs,
  },
});
