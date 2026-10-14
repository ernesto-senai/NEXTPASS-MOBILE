import { StyleSheet, Text, View } from "react-native";
import { cores, espacamento, fonte } from "@/theme";
import { CampoTexto } from "./campo-texto";
import { GrupoCampo } from "./grupo-campo";

export interface Faixa {
  min: string;
  max: string;
}

interface FaixaNumericaProps {
  rotulo: string;
  // Unidade mostrada no rótulo: "Peso (kg)".
  unidade: string;
  valor: Faixa;
  onAlterar: (valor: Faixa) => void;
}

// Filtro "mínimo até máximo" do protótipo (idade, peso, altura). Os dois campos
// curtos ficam lado a lado e cabem a partir de 320px.
export function FaixaNumerica({ rotulo, unidade, valor, onAlterar }: FaixaNumericaProps) {
  const campo = (lado: keyof Faixa, nome: string) => (
    <View style={styles.campo}>
      <CampoTexto
        semRotulo
        rotulo={`${rotulo} ${nome}, em ${unidade}`}
        placeholder={nome === "mínimo" ? "Mínimo" : "Máximo"}
        value={valor[lado]}
        onChangeText={(texto) => onAlterar({ ...valor, [lado]: texto.replace(/\D/g, "") })}
        keyboardType="number-pad"
        maxLength={3}
      />
    </View>
  );

  return (
    <GrupoCampo rotulo={`${rotulo} (${unidade})`}>
      <View style={styles.linha}>
        {campo("min", "mínimo")}
        <Text style={styles.ate}>até</Text>
        {campo("max", "máximo")}
      </View>
    </GrupoCampo>
  );
}

// Converte o texto do campo para número; vazio vira "sem filtro".
export const numeroOuNada = (texto: string) => (texto ? Number(texto) : undefined);

const styles = StyleSheet.create({
  linha: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacamento.sm,
  },
  campo: {
    flex: 1,
    minWidth: 0,
  },
  ate: {
    color: cores.textoSecundario,
    fontSize: fonte.apoio,
  },
});
