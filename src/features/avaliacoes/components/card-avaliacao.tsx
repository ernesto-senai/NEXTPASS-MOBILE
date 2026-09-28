import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps, ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Avatar } from "@/components/ui/avatar";
import { BarraProgresso } from "@/components/ui/barra-progresso";
import { Botao } from "@/components/ui/botao";
import { Etiqueta } from "@/components/ui/etiqueta";
import { useLayoutResponsivo } from "@/hooks/use-layout-responsivo";
import { formatarCategoria, formatarData, formatarHora } from "@/lib/formatadores";
import { cores, espacamento, fonte, raio } from "@/theme";
import type { StatusInscricao } from "@/types/api";
import type { AvaliacaoResumo } from "../api";

interface CardAvaliacaoProps {
  avaliacao: AvaliacaoResumo;
  // Nas abas Inscrições e Participadas, mostra o status no lugar de "Participar".
  statusInscricao?: StatusInscricao;
  onAbrir: () => void;
}

const rotuloStatus: Record<StatusInscricao, ComponentProps<typeof Etiqueta>> = {
  AGUARDANDO_RESPONSAVEL: { texto: "Aguardando responsável", tom: "alerta", icone: "time-outline" },
  CONFIRMADA: { texto: "Confirmada", tom: "destaque", icone: "checkmark-circle-outline" },
  CANCELADA: { texto: "Cancelada", tom: "neutro" },
  RECUSADA: { texto: "Recusada", tom: "neutro" },
  REMOVIDA: { texto: "Removida", tom: "neutro" },
};

// Card da avaliação no feed do atleta (RF-18). Em telas compactas, o rodapé
// empilha as vagas e o botão, que passa a ocupar a largura toda.
export function CardAvaliacao({ avaliacao, statusInscricao, onAbrir }: CardAvaliacaoProps) {
  const { compacto } = useLayoutResponsivo();
  const esgotada = avaliacao.status === "ESGOTADA";
  const tituloBotao = statusInscricao
    ? "Ver detalhes"
    : esgotada
      ? "Vagas esgotadas"
      : "Participar";

  return (
    <View style={[styles.card, compacto && styles.cardCompacto]}>
      <View style={styles.topo}>
        {/* RN-05: o clube só aparece para olheiro com vínculo comprovado. */}
        {avaliacao.clube ? (
          <Avatar nome={avaliacao.clube} tamanho={compacto ? 44 : 56} />
        ) : (
          <View style={[styles.semClube, compacto && styles.semClubeCompacto]}>
            <Ionicons name="football-outline" size={compacto ? 22 : 26} color={cores.primaria} />
          </View>
        )}

        <View style={styles.info}>
          <Text style={styles.nome} numberOfLines={2} accessibilityRole="header">
            {avaliacao.nome}
          </Text>
          <View style={styles.etiquetas}>
            <Etiqueta texto={formatarCategoria(avaliacao.categoria)} tom="destaque" />
            {avaliacao.tipo === "TESTE" ? <Etiqueta texto="Teste individual" /> : null}
            {statusInscricao ? <Etiqueta {...rotuloStatus[statusInscricao]} /> : null}
          </View>
          <Linha icone="calendar-outline">
            {formatarData(avaliacao.dataHora)} · {formatarHora(avaliacao.dataHora)}
          </Linha>
          <Linha icone="location-outline">
            {avaliacao.local} – {avaliacao.cidade}, {avaliacao.uf}
          </Linha>
        </View>
      </View>

      <View style={styles.divisor} />

      <View style={compacto ? styles.rodapeEmpilhado : styles.rodapeEmLinha}>
        <View style={styles.vagas}>
          <Ionicons name="people-outline" size={18} color={cores.primaria} />
          <Text style={styles.textoVagas}>
            {avaliacao.vagasOcupadas}/{avaliacao.vagas} vagas
          </Text>
          <View style={styles.barra}>
            <BarraProgresso
              atual={avaliacao.vagasOcupadas}
              total={avaliacao.vagas}
              rotuloAcessivel="Vagas preenchidas"
            />
          </View>
        </View>
        <Botao
          titulo={tituloBotao}
          tamanho="compacto"
          variante={statusInscricao ? "contorno" : "primario"}
          desativado={!statusInscricao && esgotada}
          onPress={onAbrir}
        />
      </View>
    </View>
  );
}

function Linha({
  icone,
  children,
}: {
  icone: ComponentProps<typeof Ionicons>["name"];
  children: ReactNode;
}) {
  return (
    <View style={styles.linha}>
      <Ionicons name={icone} size={16} color={cores.primaria} style={styles.iconeLinha} />
      <Text style={styles.textoLinha} numberOfLines={2}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 12,
    padding: espacamento.md,
    borderRadius: raio.lg,
    backgroundColor: cores.superficie,
  },
  cardCompacto: {
    padding: 12,
  },
  topo: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  semClube: {
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 28,
    borderWidth: 2,
    borderColor: cores.borda,
  },
  semClubeCompacto: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  info: {
    flex: 1,
    minWidth: 0,
    gap: 6,
  },
  nome: {
    color: cores.texto,
    fontSize: fonte.corpo + 1,
    fontWeight: "800",
  },
  etiquetas: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  linha: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
  },
  iconeLinha: {
    marginTop: 1,
  },
  textoLinha: {
    flex: 1,
    color: cores.texto,
    fontSize: fonte.apoio,
    lineHeight: 19,
  },
  divisor: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: cores.bordaCampo,
  },
  rodapeEmLinha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rodapeEmpilhado: {
    gap: 12,
  },
  vagas: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  textoVagas: {
    color: cores.textoSecundario,
    fontSize: fonte.apoio - 1,
  },
  barra: {
    flex: 1,
    minWidth: 40,
  },
});
