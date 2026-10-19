import { StyleSheet, Text, View } from "react-native";
import { Avatar } from "@/components/ui/avatar";
import { FichaTecnica } from "@/features/atletas/components/ficha-tecnica";
import { useLayoutResponsivo } from "@/hooks/use-layout-responsivo";
import { formatarAltura, formatarCategoria } from "@/lib/formatadores";
import { PES_PREFERENCIAIS, POSICOES, rotuloDe } from "@/lib/rotulos";
import { cores, espacamento, fonte, raio } from "@/theme";
import type { Perfil, PerfilAtleta } from "../api";

const SEM_DADO = "—";

// Cartão do topo do perfil (protótipo "Perfil Atleta"): foto, nome, posições
// e ficha técnica. Enquanto o perfil está incompleto, os dados aparecem com "—".
export function CabecalhoAtleta({ perfil, atleta }: { perfil: Perfil; atleta: PerfilAtleta }) {
  const { compacto } = useLayoutResponsivo();
  const posicoes = atleta.posicoes.map((posicao) => rotuloDe(POSICOES, posicao)).join(", ");
  const local = [atleta.cidade, atleta.uf].filter(Boolean).join(", ");
  const detalhes = [atleta.idade === null ? null : `${atleta.idade} anos`, local || null]
    .filter(Boolean)
    .join(" · ");

  return (
    <View style={styles.cartao}>
      <Avatar nome={perfil.nome} fotoUrl={perfil.fotoUrl} tamanho={compacto ? 72 : 88} />
      <Text
        style={[styles.nome, { fontSize: compacto ? fonte.tituloCompacto : fonte.titulo }]}
        accessibilityRole="header"
      >
        {perfil.nome}
      </Text>
      {posicoes ? <Text style={styles.detalhe}>{posicoes}</Text> : null}
      {detalhes ? <Text style={styles.detalhe}>{detalhes}</Text> : null}

      <View style={styles.ficha}>
        <FichaTecnica
          itens={[
            {
              rotulo: "Categoria",
              valor: atleta.categoria ? formatarCategoria(atleta.categoria) : SEM_DADO,
            },
            {
              rotulo: "Altura",
              valor: atleta.alturaCm ? formatarAltura(atleta.alturaCm) : SEM_DADO,
            },
            {
              rotulo: "Pé",
              valor: atleta.pePreferencial
                ? rotuloDe(PES_PREFERENCIAIS, atleta.pePreferencial)
                : SEM_DADO,
            },
          ]}
        />
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
