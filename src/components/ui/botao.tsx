import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import type { ComponentProps } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import {
  alturaBotao,
  areaToqueMinima,
  cores,
  espacamento,
  fonte,
  gradientePrimario,
  raio,
} from "@/theme";

type NomeIcone = ComponentProps<typeof Ionicons>["name"];

interface BotaoProps {
  titulo: string;
  onPress: () => void;
  variante?: "primario" | "contorno";
  // "compacto" (44 pt, o mínimo do RNF-14) é para botões dentro de cards.
  tamanho?: "normal" | "compacto";
  iconeInicio?: NomeIcone;
  iconeFim?: NomeIcone;
  carregando?: boolean;
  desativado?: boolean;
}

export function Botao({
  titulo,
  onPress,
  variante = "primario",
  tamanho = "normal",
  iconeInicio,
  iconeFim,
  carregando = false,
  desativado = false,
}: BotaoProps) {
  const inativo = desativado || carregando;
  const compacto = tamanho === "compacto";

  const conteudo = carregando ? (
    <ActivityIndicator color={cores.texto} />
  ) : (
    <>
      {iconeInicio ? <Ionicons name={iconeInicio} size={20} color={cores.texto} /> : null}
      <Text style={[styles.titulo, compacto && styles.tituloCompacto]} numberOfLines={1}>
        {titulo}
      </Text>
      {iconeFim ? <Ionicons name={iconeFim} size={20} color={cores.texto} /> : null}
    </>
  );

  return (
    <Pressable
      onPress={onPress}
      disabled={inativo}
      accessibilityRole="button"
      accessibilityLabel={titulo}
      accessibilityState={{ disabled: inativo, busy: carregando }}
      style={({ pressed }) => [
        styles.base,
        pressed && styles.pressionado,
        desativado && styles.desativado,
      ]}
    >
      {variante === "primario" ? (
        <LinearGradient
          colors={gradientePrimario}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.preenchimento, compacto && styles.preenchimentoCompacto]}
        >
          {conteudo}
        </LinearGradient>
      ) : (
        <View
          style={[styles.preenchimento, compacto && styles.preenchimentoCompacto, styles.contorno]}
        >
          {conteudo}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: raio.md,
    overflow: "hidden",
  },
  preenchimento: {
    minHeight: alturaBotao,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: espacamento.sm,
    paddingHorizontal: espacamento.md,
  },
  preenchimentoCompacto: {
    minHeight: areaToqueMinima,
    paddingHorizontal: espacamento.md - 2,
  },
  contorno: {
    borderWidth: 1,
    borderColor: cores.bordaCampo,
    borderRadius: raio.md,
    backgroundColor: cores.fundoCampo,
  },
  titulo: {
    flexShrink: 1,
    color: cores.texto,
    fontSize: fonte.botao,
    fontWeight: "700",
  },
  tituloCompacto: {
    fontSize: fonte.apoio + 1,
  },
  pressionado: {
    opacity: 0.85,
  },
  desativado: {
    opacity: 0.5,
  },
});
