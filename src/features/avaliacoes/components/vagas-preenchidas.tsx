import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { BarraProgresso } from "@/components/ui/barra-progresso";
import { cores, fonte } from "@/theme";

interface VagasPreenchidasProps {
  ocupadas: number;
  total: number;
  // "vagas" no card do atleta; "participantes" no do olheiro (RF-42).
  unidade?: string;
}

// Vagas ocupadas da avaliação com a barra de preenchimento (RF-18, RN-06).
export function VagasPreenchidas({ ocupadas, total, unidade = "vagas" }: VagasPreenchidasProps) {
  return (
    <View style={styles.linha}>
      <Ionicons name="people-outline" size={18} color={cores.primaria} />
      <Text style={styles.texto}>
        {ocupadas}/{total} {unidade}
      </Text>
      <View style={styles.barra}>
        <BarraProgresso atual={ocupadas} total={total} rotuloAcessivel={`${unidade} preenchidas`} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  linha: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  texto: {
    color: cores.textoSecundario,
    fontSize: fonte.apoio - 1,
  },
  barra: {
    flex: 1,
    minWidth: 40,
  },
});
