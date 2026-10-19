import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { LinkTexto } from "@/components/ui/link-texto";
import { ListaPaginada } from "@/components/ui/lista-paginada";
import { TelaLista } from "@/components/ui/tela-lista";
import { TituloSecao } from "@/components/ui/titulo-secao";
import { TituloTela } from "@/components/ui/titulo-tela";
import { CardMinhaAvaliacao } from "@/features/avaliacoes/components/card-minha-avaliacao";
import { useMinhasAvaliacoes } from "@/features/avaliacoes/hooks";
import { ItemNotificacao } from "@/features/notificacoes/components/item-notificacao";
import { useMarcarComoLidas, useNotificacoes } from "@/features/notificacoes/hooks";
import { useLayoutResponsivo } from "@/hooks/use-layout-responsivo";
import { areaToqueMinima, cores, espacamento, fonte } from "@/theme";

// Respostas a convites e novas inscrições (RF-47, RF-52)
export default function NotificacoesOlheiro() {
  const router = useRouter();
  const { espacoEntreCampos } = useLayoutResponsivo();
  const notificacoes = useNotificacoes();
  const marcar = useMarcarComoLidas();
  // Destaque do protótipo: a próxima avaliação, com atalho para os participantes.
  const proxima = useMinhasAvaliacoes("proximas").data?.pages[0]?.dados[0];
  const naoLidas = notificacoes.data?.pages[0]?.naoLidas ?? 0;

  return (
    <TelaLista>
      <TituloTela>Notificações</TituloTela>
      <ListaPaginada
        consulta={notificacoes}
        chave={(notificacao) => notificacao.id}
        renderItem={(notificacao) => (
          <ItemNotificacao
            notificacao={notificacao}
            onAbrir={() => {
              if (!notificacao.lida) marcar.mutate([notificacao.id]);
            }}
          />
        )}
        cabecalho={
          <View style={[styles.cabecalho, { gap: espacoEntreCampos }]}>
            {notificacoes.data ? (
              <View style={styles.resumo}>
                <Text style={styles.textoResumo} accessibilityLiveRegion="polite">
                  {naoLidas === 0
                    ? "Tudo em dia"
                    : `${naoLidas} ${naoLidas === 1 ? "não lida" : "não lidas"}`}
                </Text>
                {naoLidas > 0 ? (
                  <LinkTexto onPress={() => marcar.mutate(undefined)}>
                    Marcar todas como lidas
                  </LinkTexto>
                ) : null}
              </View>
            ) : null}
            {proxima ? (
              <>
                <TituloSecao>Próxima avaliação</TituloSecao>
                <CardMinhaAvaliacao
                  avaliacao={proxima}
                  onVerParticipantes={() =>
                    router.push({
                      pathname: "/olheiro/avaliacoes/[id]/participantes",
                      params: { id: proxima.id },
                    })
                  }
                />
                <TituloSecao>Recentes</TituloSecao>
              </>
            ) : null}
          </View>
        }
        vazio={{
          icone: "notifications-outline",
          titulo: "Nenhuma notificação",
          descricao:
            "Aqui aparecem as respostas aos seus convites e as novas inscrições nas suas avaliações.",
        }}
      />
    </TelaLista>
  );
}

const styles = StyleSheet.create({
  cabecalho: {
    marginBottom: espacamento.md,
  },
  // Altura fixa: a linha não pula quando o link some.
  resumo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: areaToqueMinima,
    marginTop: -espacamento.sm,
  },
  textoResumo: {
    color: cores.textoSecundario,
    fontSize: fonte.apoio,
    fontWeight: "600",
  },
});
