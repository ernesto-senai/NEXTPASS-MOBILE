import { StyleSheet, Text, View } from "react-native";
import { Avatar } from "@/components/ui/avatar";
import { Botao } from "@/components/ui/botao";
import { Etiqueta } from "@/components/ui/etiqueta";
import { POSICOES, rotuloDe } from "@/lib/rotulos";
import { cores, espacamento, fonte, raio } from "@/theme";
import type { Participante } from "../api";

interface ItemParticipanteProps {
  participante: Participante;
  onVerPerfil: () => void;
  onRemover: () => void;
  removendo: boolean;
}

// Participante na lista do olheiro (RF-44 a RF-46): foto, nome, idade,
// posições, cidade, a situação da inscrição e as ações.
export function ItemParticipante({
  participante: { atleta, status },
  onVerPerfil,
  onRemover,
  removendo,
}: ItemParticipanteProps) {
  const posicoes = atleta.posicoes.map((posicao) => rotuloDe(POSICOES, posicao)).join(", ");
  const local = [atleta.cidade, atleta.uf].filter(Boolean).join(", ");
  const detalhes = [atleta.idade === null ? null : `${atleta.idade} anos`, local || null]
    .filter(Boolean)
    .join(" · ");

  return (
    <View style={styles.item}>
      <View style={styles.topo}>
        <Avatar nome={atleta.nome} fotoUrl={atleta.fotoUrl} tamanho={48} />
        <View style={styles.info}>
          <Text style={styles.nome} numberOfLines={1}>
            {atleta.nome}
          </Text>
          {posicoes ? (
            <Text style={styles.detalhe} numberOfLines={1}>
              {posicoes}
            </Text>
          ) : null}
          {detalhes ? <Text style={styles.detalhe}>{detalhes}</Text> : null}
          {/* RN-03: o menor só confirma depois da aprovação do responsável. */}
          {status === "AGUARDANDO_RESPONSAVEL" ? (
            <Etiqueta texto="Aguardando responsável" tom="alerta" icone="time-outline" />
          ) : (
            <Etiqueta texto="Confirmado" tom="destaque" icone="checkmark-circle-outline" />
          )}
        </View>
      </View>

      <View style={styles.botoes}>
        <View style={styles.botao}>
          <Botao titulo="Ver perfil" tamanho="compacto" onPress={onVerPerfil} />
        </View>
        <View style={styles.botao}>
          <Botao
            titulo="Remover"
            tamanho="compacto"
            variante="contorno"
            carregando={removendo}
            onPress={onRemover}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    gap: 12,
    padding: 12,
    borderRadius: raio.lg,
    backgroundColor: cores.superficie,
  },
  topo: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  info: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  nome: {
    color: cores.texto,
    fontSize: fonte.corpo,
    fontWeight: "800",
  },
  detalhe: {
    color: cores.textoSecundario,
    fontSize: fonte.apoio,
  },
  botoes: {
    flexDirection: "row",
    gap: espacamento.sm,
  },
  botao: {
    flex: 1,
    minWidth: 0,
  },
});
