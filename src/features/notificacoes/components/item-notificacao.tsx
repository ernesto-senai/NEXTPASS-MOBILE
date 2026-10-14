import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { formatarTempoRelativo } from "@/lib/formatadores";
import { cores, espacamento, fonte, raio } from "@/theme";
import type { TipoNotificacao } from "@/types/api";
import type { Notificacao } from "../api";

const APARENCIA: Record<
  TipoNotificacao,
  { titulo: string; icone: ComponentProps<typeof Ionicons>["name"] }
> = {
  NOVO_CONVITE: { titulo: "Novo convite", icone: "mail-outline" },
  COPIA_CONVITE: { titulo: "Cópia de convite", icone: "copy-outline" },
  CONVITE_RESPONDIDO: { titulo: "Convite respondido", icone: "chatbubble-ellipses-outline" },
  APROVAR_INSCRICAO: { titulo: "Aprovar inscrição", icone: "shield-checkmark-outline" },
  NOVA_INSCRICAO: { titulo: "Nova inscrição", icone: "person-add-outline" },
  INSCRICAO_ATUALIZADA: { titulo: "Inscrição atualizada", icone: "refresh-outline" },
  AVALIACAO_ALTERADA: { titulo: "Avaliação alterada", icone: "calendar-outline" },
  VERIFICACAO_ANALISADA: { titulo: "Verificação analisada", icone: "id-card-outline" },
};

interface ItemNotificacaoProps {
  notificacao: Notificacao;
  onAbrir: () => void;
}

// Aviso da lista "Recentes" (RF-52). Não lido: borda verde, título em
// destaque e um ponto à direita; o leitor de tela diz "Não lida".
export function ItemNotificacao({ notificacao, onAbrir }: ItemNotificacaoProps) {
  const { titulo, icone } = APARENCIA[notificacao.tipo];
  const naoLida = !notificacao.lida;

  return (
    <Pressable
      onPress={onAbrir}
      accessibilityRole="button"
      accessibilityLabel={`${naoLida ? "Não lida. " : ""}${titulo}. ${notificacao.texto}`}
      style={({ pressed }) => [
        styles.item,
        naoLida && styles.itemNaoLido,
        pressed && styles.pressionado,
      ]}
    >
      <View style={styles.icone}>
        <Ionicons name={icone} size={20} color={cores.primaria} />
      </View>
      <View style={styles.textos}>
        <View style={styles.linhaTitulo}>
          <Text style={[styles.titulo, naoLida && styles.tituloNaoLido]} numberOfLines={1}>
            {titulo}
          </Text>
          <Text style={styles.tempo}>{formatarTempoRelativo(notificacao.criadoEm)}</Text>
        </View>
        <Text style={styles.texto}>{notificacao.texto}</Text>
      </View>
      {naoLida ? <View style={styles.ponto} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minHeight: 64,
    padding: 12,
    borderWidth: 1,
    borderColor: cores.bordaCampo,
    borderRadius: raio.md,
    backgroundColor: cores.superficie,
  },
  itemNaoLido: {
    borderColor: cores.borda,
  },
  pressionado: {
    opacity: 0.85,
  },
  icone: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: "rgba(80, 160, 65, 0.12)",
  },
  textos: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  linhaTitulo: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: espacamento.sm,
  },
  titulo: {
    flex: 1,
    color: cores.textoSecundario,
    fontSize: fonte.apoio + 1,
    fontWeight: "700",
  },
  tituloNaoLido: {
    color: cores.texto,
  },
  tempo: {
    color: cores.textoSecundario,
    fontSize: fonte.rotulo,
  },
  texto: {
    color: cores.texto,
    fontSize: fonte.apoio,
    lineHeight: 19,
  },
  ponto: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: cores.primaria,
  },
});
