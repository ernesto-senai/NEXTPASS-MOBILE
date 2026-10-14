import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { BotaoIcone } from "@/components/ui/botao-icone";
import { formatarData, formatarDuracao, formatarVisualizacoes } from "@/lib/formatadores";
import { cores, espacamento, fonte, raio } from "@/theme";
import type { LanceDoAtleta } from "../api";

interface ItemMeuLanceProps {
  lance: LanceDoAtleta;
  // Enquanto uma alteração está a caminho, os botões ficam travados.
  ocupado: boolean;
  onAlternarDestaque: () => void;
  onExcluir: () => void;
}

// RF-30 e RF-31: lance na lista "Meus lances", com a estrela de destaque e a
// lixeira.
export function ItemMeuLance({ lance, ocupado, onAlternarDestaque, onExcluir }: ItemMeuLanceProps) {
  return (
    <View style={styles.item}>
      <View style={styles.miniatura}>
        <Ionicons name="play" size={16} color={cores.primaria} />
        <Text style={styles.duracao}>{formatarDuracao(lance.duracaoSeg)}</Text>
      </View>

      <View style={styles.textos}>
        <Text style={styles.legenda} numberOfLines={1}>
          {lance.legenda ?? "Lance sem legenda"}
        </Text>
        <Text style={styles.detalhe} numberOfLines={1}>
          {formatarData(lance.criadoEm)} · {formatarVisualizacoes(lance.visualizacoes)}
        </Text>
      </View>

      <BotaoIcone
        icone={lance.destaque ? "star" : "star-outline"}
        rotulo={lance.destaque ? "Tirar dos destaques" : "Destacar no perfil"}
        cor={lance.destaque ? cores.primaria : cores.textoSecundario}
        selecionado={lance.destaque}
        desativado={ocupado}
        onPress={onAlternarDestaque}
      />
      <BotaoIcone
        icone="trash-outline"
        rotulo="Excluir lance"
        cor={cores.erro}
        desativado={ocupado}
        onPress={onExcluir}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacamento.xs,
    paddingVertical: espacamento.xs,
    paddingLeft: espacamento.sm,
    borderWidth: 1,
    borderColor: cores.bordaCampo,
    borderRadius: raio.md,
    backgroundColor: cores.superficie,
  },
  miniatura: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: raio.sm,
    backgroundColor: cores.fundoCampo,
  },
  duracao: {
    color: cores.textoSecundario,
    fontSize: fonte.rotulo - 1,
  },
  textos: {
    flex: 1,
    minWidth: 0,
    gap: 2,
    marginLeft: espacamento.xs,
  },
  legenda: {
    color: cores.texto,
    fontSize: fonte.apoio + 1,
    fontWeight: "600",
  },
  detalhe: {
    color: cores.textoSecundario,
    fontSize: fonte.rotulo,
  },
});
