import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { StyleSheet, Text, View } from "react-native";
import { cores, espacamento, fonte } from "@/theme";
import { Botao } from "./botao";

interface EstadoVazioProps {
  icone: ComponentProps<typeof Ionicons>["name"];
  titulo: string;
  descricao?: string;
  acao?: { titulo: string; onPress: () => void };
}

// Tela ou lista sem conteúdo: vazio, erro ou acesso ainda não liberado.
export function EstadoVazio({ icone, titulo, descricao, acao }: EstadoVazioProps) {
  return (
    <View style={styles.bloco}>
      <Ionicons name={icone} size={44} color={cores.primaria} />
      <Text style={styles.titulo} accessibilityRole="header">
        {titulo}
      </Text>
      {descricao ? <Text style={styles.descricao}>{descricao}</Text> : null}
      {acao ? (
        <View style={styles.acao}>
          <Botao titulo={acao.titulo} onPress={acao.onPress} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bloco: {
    alignItems: "center",
    gap: espacamento.sm,
    paddingVertical: espacamento.xl,
    paddingHorizontal: espacamento.md,
  },
  titulo: {
    color: cores.texto,
    fontSize: fonte.corpo + 2,
    fontWeight: "700",
    textAlign: "center",
  },
  descricao: {
    color: cores.textoSecundario,
    fontSize: fonte.apoio + 1,
    lineHeight: 21,
    textAlign: "center",
  },
  acao: {
    alignSelf: "stretch",
    marginTop: espacamento.sm,
  },
});
