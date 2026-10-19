import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Pressable, StyleSheet } from "react-native";
import { areaToqueMinima, cores } from "@/theme";

interface BotaoIconeProps {
  icone: ComponentProps<typeof Ionicons>["name"];
  // Lido pelo leitor de tela, já que o botão não tem texto.
  rotulo: string;
  onPress: () => void;
  cor?: string;
  // Botões de liga/desliga (ex.: estrela de destaque).
  selecionado?: boolean;
  desativado?: boolean;
}

// Botão só com ícone, com área de toque de 44 pt (RNF-14).
export function BotaoIcone({
  icone,
  rotulo,
  onPress,
  cor = cores.texto,
  selecionado,
  desativado = false,
}: BotaoIconeProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={desativado}
      accessibilityRole="button"
      accessibilityLabel={rotulo}
      aria-pressed={selecionado}
      aria-disabled={desativado}
      style={({ pressed }) => [
        styles.botao,
        pressed && styles.pressionado,
        desativado && styles.desativado,
      ]}
    >
      <Ionicons name={icone} size={22} color={cor} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  botao: {
    width: areaToqueMinima,
    height: areaToqueMinima,
    alignItems: "center",
    justifyContent: "center",
  },
  pressionado: {
    opacity: 0.6,
  },
  desativado: {
    opacity: 0.4,
  },
});
