import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Avatar } from "@/components/ui/avatar";
import { useLayoutResponsivo } from "@/hooks/use-layout-responsivo";
import { cores, espacamento, fonte, raio } from "@/theme";
import { FichaTecnica } from "./ficha-tecnica";

interface CartaoAtletaProps {
  nome: string;
  fotoUrl: string | null;
  // Linhas abaixo do nome (posições; idade e cidade).
  detalhes: string[];
  ficha: { rotulo: string; valor: string }[];
  // No próprio perfil, a foto vem com o botão de trocar (RF-14).
  foto?: ReactNode;
}

// Cartão do topo do perfil do atleta (protótipo "Perfil Atleta"): foto, nome,
// posições e ficha técnica. É o mesmo no perfil do atleta e na visão do olheiro.
export function CartaoAtleta({ nome, fotoUrl, detalhes, ficha, foto }: CartaoAtletaProps) {
  const { compacto } = useLayoutResponsivo();

  return (
    <View style={styles.cartao}>
      {foto ?? <Avatar nome={nome} fotoUrl={fotoUrl} tamanho={compacto ? 72 : 88} />}
      <Text
        style={[styles.nome, { fontSize: compacto ? fonte.tituloCompacto : fonte.titulo }]}
        accessibilityRole="header"
      >
        {nome}
      </Text>
      {detalhes.filter(Boolean).map((detalhe) => (
        <Text key={detalhe} style={styles.detalhe}>
          {detalhe}
        </Text>
      ))}

      <View style={styles.ficha}>
        <FichaTecnica itens={ficha} />
      </View>
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
  detalhe: {
    color: cores.textoSecundario,
    fontSize: fonte.apoio,
    textAlign: "center",
  },
  ficha: {
    alignSelf: "stretch",
    marginTop: espacamento.sm,
  },
});
