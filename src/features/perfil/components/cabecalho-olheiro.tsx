import { StyleSheet, Text, View } from "react-native";
import { Etiqueta } from "@/components/ui/etiqueta";
import { useLayoutResponsivo } from "@/hooks/use-layout-responsivo";
import { cores, espacamento, fonte, raio } from "@/theme";
import type { Perfil } from "../api";
import { FotoPerfil } from "./foto-perfil";

// Cartão do topo do perfil do olheiro (protótipo "Perfil Olheiro"): foto,
// nome, atuação e a situação da verificação (RN-04). A foto pode ser trocada (RF-14).
export function CabecalhoOlheiro({ perfil }: { perfil: Perfil }) {
  const { compacto } = useLayoutResponsivo();
  const { olheiro } = perfil;
  const atuacao = olheiro?.clube ? `Olheiro · ${olheiro.clube}` : "Olheiro (Independente)";

  return (
    <View style={styles.cartao}>
      <FotoPerfil nome={perfil.nome} fotoUrl={perfil.fotoUrl} />
      <Text
        style={[styles.nome, { fontSize: compacto ? fonte.tituloCompacto : fonte.titulo }]}
        accessibilityRole="header"
      >
        {perfil.nome}
      </Text>
      <Text style={styles.atuacao}>{atuacao}</Text>
      {olheiro?.verificado ? (
        <Etiqueta texto="Verificado" tom="destaque" icone="shield-checkmark-outline" />
      ) : (
        <Etiqueta texto="Em verificação" tom="alerta" icone="time-outline" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cartao: {
    alignItems: "center",
    gap: espacamento.xs,
    padding: espacamento.md,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: raio.lg,
    backgroundColor: "rgba(36, 75, 43, 0.35)",
  },
  nome: {
    marginTop: espacamento.xs,
    color: cores.texto,
    fontWeight: "800",
    textAlign: "center",
  },
  atuacao: {
    color: cores.textoSecundario,
    fontSize: fonte.apoio,
    textAlign: "center",
    marginBottom: espacamento.xs,
  },
});
