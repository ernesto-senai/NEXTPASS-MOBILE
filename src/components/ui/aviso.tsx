import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { StyleSheet, Text, View } from "react-native";
import { cores, espacamento, fonte, raio } from "@/theme";
import { LinkTexto } from "./link-texto";

interface AvisoProps {
  icone: ComponentProps<typeof Ionicons>["name"];
  titulo: string;
  texto: string;
  acao?: { titulo: string; onPress: () => void };
}

// Pendência que o usuário resolve em outra tela (ex.: completar o perfil).
export function Aviso({ icone, titulo, texto, acao }: AvisoProps) {
  return (
    <View style={styles.caixa}>
      <Ionicons name={icone} size={22} color="#F5B43C" />
      <View style={styles.textos}>
        <Text style={styles.titulo} accessibilityRole="header">
          {titulo}
        </Text>
        <Text style={styles.texto}>{texto}</Text>
        {acao ? (
          <View style={styles.acao}>
            <LinkTexto onPress={acao.onPress}>{acao.titulo}</LinkTexto>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  caixa: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(245, 180, 60, 0.5)",
    borderRadius: raio.md,
    backgroundColor: "rgba(245, 180, 60, 0.08)",
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
  texto: {
    color: cores.textoSecundario,
    fontSize: fonte.apoio,
    lineHeight: 19,
  },
  acao: {
    alignItems: "flex-start",
    marginLeft: -espacamento.xs,
    marginBottom: -espacamento.sm,
  },
});
