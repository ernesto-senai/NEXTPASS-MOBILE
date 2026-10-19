import { StyleSheet, Text, View } from "react-native";
import { Avatar } from "@/components/ui/avatar";
import { LinkTexto } from "@/components/ui/link-texto";
import { useLayoutResponsivo } from "@/hooks/use-layout-responsivo";
import { formatarAltura, formatarCategoria } from "@/lib/formatadores";
import { PES_PREFERENCIAIS, POSICOES, rotuloDe } from "@/lib/rotulos";
import { cores, espacamento, fonte, raio } from "@/theme";
import type { AtletaResumo } from "../api";
import { FichaTecnica } from "./ficha-tecnica";

interface CardAtletaProps {
  atleta: AtletaResumo;
  onVerLances: () => void;
}

// Card do atleta na busca do olheiro (RF-37): foto, nome, posição, idade,
// estado, categoria, altura, pé preferencial e o atalho "Ver lances".
export function CardAtleta({ atleta, onVerLances }: CardAtletaProps) {
  const { compacto } = useLayoutResponsivo();
  const posicoes = atleta.posicoes.map((posicao) => rotuloDe(POSICOES, posicao)).join(", ");
  const local = [atleta.cidade, atleta.uf].filter(Boolean).join(", ");

  return (
    <View style={[styles.card, compacto && styles.cardCompacto]}>
      <View style={styles.topo}>
        <Avatar nome={atleta.nome} fotoUrl={atleta.fotoUrl} tamanho={compacto ? 48 : 56} />
        <View style={styles.info}>
          <Text style={styles.nome} numberOfLines={1} accessibilityRole="header">
            {atleta.nome}
          </Text>
          <Text style={styles.detalhe} numberOfLines={2}>
            {posicoes}
          </Text>
          <Text style={styles.detalhe} numberOfLines={1}>
            {atleta.idade} anos · {local}
          </Text>
        </View>
      </View>

      <FichaTecnica
        itens={[
          { rotulo: "Categoria", valor: formatarCategoria(atleta.categoria) },
          { rotulo: "Altura", valor: formatarAltura(atleta.alturaCm) },
          { rotulo: "Pé", valor: rotuloDe(PES_PREFERENCIAIS, atleta.pePreferencial) },
        ]}
      />

      <View style={styles.acao}>
        <LinkTexto onPress={onVerLances}>Ver lances</LinkTexto>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 12,
    padding: espacamento.md,
    borderRadius: raio.lg,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.superficie,
  },
  cardCompacto: {
    padding: 12,
  },
  topo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  info: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  nome: {
    color: cores.texto,
    fontSize: fonte.corpo + 1,
    fontWeight: "800",
  },
  detalhe: {
    color: cores.textoSecundario,
    fontSize: fonte.apoio,
  },
  acao: {
    alignItems: "flex-end",
    marginTop: -espacamento.sm,
  },
});
