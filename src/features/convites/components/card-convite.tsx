import { useRouter } from "expo-router";
import type { ComponentProps } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Botao } from "@/components/ui/botao";
import type { Etiqueta } from "@/components/ui/etiqueta";
import { LinkTexto } from "@/components/ui/link-texto";
import { MensagemErro } from "@/components/ui/mensagem-erro";
import { ResumoAvaliacao } from "@/features/avaliacoes/components/resumo-avaliacao";
import { useLayoutResponsivo } from "@/hooks/use-layout-responsivo";
import { mensagemDeErro } from "@/services/api/client";
import { cores, espacamento, fonte, raio } from "@/theme";
import type { ConviteRecebido } from "../api";
import { useResponderConvite } from "../hooks";

type Situacao = ComponentProps<typeof Etiqueta>;

// Situação do convite já respondido ou expirado, no lugar dos botões.
function situacaoDoConvite({ status, inscricao }: ConviteRecebido): Situacao | undefined {
  if (status === "RECUSADO") return { texto: "Recusado", tom: "neutro" };
  if (status === "EXPIRADO") return { texto: "Expirado", tom: "neutro", icone: "time-outline" };
  if (inscricao?.status === "AGUARDANDO_RESPONSAVEL") {
    return { texto: "Aguardando responsável", tom: "alerta", icone: "time-outline" };
  }
  if (status === "ACEITO") {
    return { texto: "Inscrição confirmada", tom: "destaque", icone: "checkmark-circle-outline" };
  }
  return undefined;
}

interface CardConviteProps {
  convite: ConviteRecebido;
  // RF-49: o responsável acompanha o convite, mas quem responde é o atleta.
  paraResponsavel?: boolean;
}

// Convite na caixa do atleta (RF-26, RF-27): avaliação, olheiro, mensagem
// (até 300 caracteres, RN-10) e os botões Aceitar e Recusar.
export function CardConvite({ convite, paraResponsavel = false }: CardConviteProps) {
  const router = useRouter();
  const { compacto } = useLayoutResponsivo();
  const responder = useResponderConvite();
  const pendente = convite.status === "PENDENTE";
  const enviando = responder.isPending ? responder.variables.status : null;

  const enviar = (status: "ACEITO" | "RECUSADO") => responder.mutate({ id: convite.id, status });

  return (
    <View style={[styles.card, compacto && styles.cardCompacto]}>
      <ResumoAvaliacao
        avaliacao={convite.avaliacao}
        etiqueta={situacaoDoConvite(convite)}
        mostrarOlheiro
      />

      {paraResponsavel ? <Text style={styles.para}>Para {convite.atleta.nome}</Text> : null}
      <Text style={styles.mensagem}>“{convite.mensagem}”</Text>

      {responder.isError ? <MensagemErro mensagem={mensagemDeErro(responder.error)} /> : null}

      {pendente && !paraResponsavel ? (
        <View style={styles.botoes}>
          <View style={styles.botao}>
            <Botao
              titulo="Aceitar"
              tamanho="compacto"
              onPress={() => enviar("ACEITO")}
              carregando={enviando === "ACEITO"}
              desativado={enviando === "RECUSADO"}
            />
          </View>
          <View style={styles.botao}>
            <Botao
              titulo="Recusar"
              tamanho="compacto"
              variante="contorno"
              onPress={() => enviar("RECUSADO")}
              carregando={enviando === "RECUSADO"}
              desativado={enviando === "ACEITO"}
            />
          </View>
        </View>
      ) : null}

      {/* RF-54: convite abusivo ou suspeito vai para a moderação. */}
      <View style={styles.denunciar}>
        <LinkTexto
          onPress={() =>
            router.push({
              pathname: "/denunciar",
              params: { alvoTipo: "CONVITE", alvoId: convite.id, nome: convite.avaliacao.nome },
            })
          }
        >
          Denunciar convite
        </LinkTexto>
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
  mensagem: {
    padding: 12,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: raio.md,
    color: cores.texto,
    fontSize: fonte.apoio + 1,
    lineHeight: 21,
  },
  para: {
    color: cores.primaria,
    fontSize: fonte.apoio,
    fontWeight: "700",
  },
  botoes: {
    flexDirection: "row",
    gap: espacamento.sm,
  },
  denunciar: {
    alignItems: "flex-end",
    marginVertical: -espacamento.sm,
  },
  botao: {
    flex: 1,
    minWidth: 0,
  },
});
