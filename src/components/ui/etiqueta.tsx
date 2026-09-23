import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { StyleSheet, Text, View } from "react-native";
import { cores, espacamento, fonte } from "@/theme";

interface EtiquetaProps {
  texto: string;
  icone?: ComponentProps<typeof Ionicons>["name"];
  tom?: "neutro" | "destaque" | "alerta" | "sobreImagem";
}

const tons = {
  neutro: { fundo: "rgba(255, 255, 255, 0.08)", texto: cores.texto },
  destaque: { fundo: "rgba(80, 160, 65, 0.18)", texto: cores.primaria },
  alerta: { fundo: "rgba(245, 180, 60, 0.16)", texto: "#F5B43C" },
  // Sobre vídeo ou foto: fundo escuro para o texto ficar legível em qualquer imagem.
  sobreImagem: { fundo: "rgba(0, 0, 0, 0.6)", texto: cores.texto },
} as const;

// Rótulo curto e não tocável: categoria ("Sub-17"), tipo, status, visualizações.
export function Etiqueta({ texto, icone, tom = "neutro" }: EtiquetaProps) {
  const cor = tons[tom];

  return (
    <View style={[styles.etiqueta, { backgroundColor: cor.fundo }]}>
      {icone ? <Ionicons name={icone} size={14} color={cor.texto} /> : null}
      <Text style={[styles.texto, { color: cor.texto }]}>{texto}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  etiqueta: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: espacamento.xs,
    paddingHorizontal: espacamento.sm,
    paddingVertical: 3,
    borderRadius: 999,
  },
  texto: {
    fontSize: fonte.rotulo,
    fontWeight: "700",
  },
});
