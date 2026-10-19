import type { ComponentProps } from "react";
import { StyleSheet, View } from "react-native";
import { Botao } from "@/components/ui/botao";
import type { Etiqueta } from "@/components/ui/etiqueta";
import { useLayoutResponsivo } from "@/hooks/use-layout-responsivo";
import { cores, espacamento, raio } from "@/theme";
import type { StatusInscricao } from "@/types/api";
import type { AvaliacaoResumo } from "../api";
import { ResumoAvaliacao } from "./resumo-avaliacao";
import { VagasPreenchidas } from "./vagas-preenchidas";

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
      <ResumoAvaliacao
        avaliacao={avaliacao}
        etiqueta={statusInscricao ? rotuloStatus[statusInscricao] : undefined}
      />

      <View style={styles.divisor} />

      <View style={compacto ? styles.rodapeEmpilhado : styles.rodapeEmLinha}>
        <VagasPreenchidas ocupadas={avaliacao.vagasOcupadas} total={avaliacao.vagas} />
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
});
