import type { ComponentProps } from "react";
import { StyleSheet, View } from "react-native";
import { Botao } from "@/components/ui/botao";
import type { Etiqueta } from "@/components/ui/etiqueta";
import { useLayoutResponsivo } from "@/hooks/use-layout-responsivo";
import { cores, espacamento, raio } from "@/theme";
import type { AvaliacaoResumo } from "../api";
import { ResumoAvaliacao } from "./resumo-avaliacao";
import { VagasPreenchidas } from "./vagas-preenchidas";

interface CardMinhaAvaliacaoProps {
  avaliacao: AvaliacaoResumo;
  onVerParticipantes: () => void;
  // Sem onEditar e onCancelar (ex.: avaliações anteriores), os botões não aparecem.
  onEditar?: (() => void) | undefined;
  onCancelar?: (() => void) | undefined;
  cancelando?: boolean;
}

function situacao({
  status,
  dataHora,
}: AvaliacaoResumo): ComponentProps<typeof Etiqueta> | undefined {
  if (status === "CANCELADA") return { texto: "Cancelada", tom: "neutro" };
  if (status === "ENCERRADA" || new Date(dataHora) <= new Date()) {
    return { texto: "Encerrada", tom: "neutro" };
  }
  if (status === "ESGOTADA") return { texto: "Vagas esgotadas", tom: "alerta" };
  return undefined;
}

// Avaliação em "Minhas avaliações" (RF-42) e no destaque das Notificações:
// participantes, "Ver participantes" (RF-44), "Editar" e "Cancelar" (RF-43).
export function CardMinhaAvaliacao({
  avaliacao,
  onVerParticipantes,
  onEditar,
  onCancelar,
  cancelando = false,
}: CardMinhaAvaliacaoProps) {
  const { compacto } = useLayoutResponsivo();

  return (
    <View style={[styles.card, compacto && styles.cardCompacto]}>
      <ResumoAvaliacao avaliacao={avaliacao} etiqueta={situacao(avaliacao)} />
      <VagasPreenchidas
        ocupadas={avaliacao.vagasOcupadas}
        total={avaliacao.vagas}
        unidade="participantes"
      />
      <Botao titulo="Ver participantes" tamanho="compacto" onPress={onVerParticipantes} />
      {onEditar || onCancelar ? (
        <View style={styles.botoes}>
          {onEditar ? (
            <View style={styles.botao}>
              <Botao
                titulo="Editar"
                tamanho="compacto"
                variante="contorno"
                iconeInicio="create-outline"
                onPress={onEditar}
              />
            </View>
          ) : null}
          {onCancelar ? (
            <View style={styles.botao}>
              <Botao
                titulo="Cancelar"
                tamanho="compacto"
                variante="contorno"
                carregando={cancelando}
                onPress={onCancelar}
              />
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 12,
    padding: espacamento.md,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: raio.lg,
    backgroundColor: cores.superficie,
  },
  cardCompacto: {
    padding: 12,
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
