import { useRouter } from "expo-router";
import { useBottomTabBarHeight } from "expo-router/tabs";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  useWindowDimensions,
  View,
  type ViewToken,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EstadoVazio } from "@/components/ui/estado-vazio";
import type { LanceDoFeed } from "@/features/lances/api";
import { LanceTelaCheia } from "@/features/lances/components/lance-tela-cheia";
import { useFeedDeLances, useRegistrarVisualizacao } from "@/features/lances/hooks";
import { ApiError, mensagemDeErro } from "@/services/api/client";
import { cores, larguraMaximaConteudo } from "@/theme";

// Feed de lances com visualizações e "Chamar para Avaliação" (RF-32 a RF-34)
export default function FeedLances() {
  const router = useRouter();
  const feed = useFeedDeLances();
  const registrar = useRegistrarVisualizacao();
  // Cada lance ocupa a área acima do menu inferior. A conta sai da altura da
  // tela e é ajustada pela medida real (onLayout) quando ela chega; assim o
  // feed não fica em branco esperando a medição.
  const alturaEstimada = useWindowDimensions().height - useBottomTabBarHeight();
  const [alturaMedida, setAlturaMedida] = useState(0);
  const altura = alturaMedida || alturaEstimada;
  const lances = feed.data?.pages.flatMap((pagina) => pagina.dados) ?? [];
  // O primeiro lance já começa ativo; ao rolar, o lance visível assume.
  const [visivel, setVisivel] = useState<string | null>(null);
  const ativo = visivel ?? lances[0]?.id ?? null;
  const vistos = useRef(new Set<string>());

  // O FlatList exige que esta função não mude entre renderizações.
  const aoMudarVisiveis = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken<LanceDoFeed>[] }) => {
      const lance = viewableItems[0]?.item;
      if (lance) setVisivel(lance.id);
    },
    [],
  );

  // Cada lance conta uma visualização por vez que o feed é aberto.
  const { mutate: registrarVisualizacao } = registrar;
  useEffect(() => {
    if (ativo && !vistos.current.has(ativo)) {
      vistos.current.add(ativo);
      registrarVisualizacao(ativo);
    }
  }, [ativo, registrarVisualizacao]);

  if (feed.isPending) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator color={cores.primaria} size="large" />
      </View>
    );
  }

  if (feed.isError) {
    // RN-04: olheiro novo vê o que falta em vez de um erro.
    const naoVerificado =
      feed.error instanceof ApiError && feed.error.codigo === "OLHEIRO_NAO_VERIFICADO";
    return (
      <SafeAreaView style={styles.centro}>
        {naoVerificado ? (
          <EstadoVazio
            icone="shield-checkmark-outline"
            titulo="Sua conta está em verificação"
            descricao="Para proteger os atletas, o feed de lances é liberado depois que a equipe do NextPass aprova seus documentos."
            acao={{
              titulo: "Enviar documentos",
              onPress: () => router.push("/olheiro/verificacao"),
            }}
          />
        ) : (
          <EstadoVazio
            icone="cloud-offline-outline"
            titulo="Não foi possível carregar"
            descricao={mensagemDeErro(feed.error)}
            acao={{ titulo: "Tentar de novo", onPress: () => feed.refetch() }}
          />
        )}
      </SafeAreaView>
    );
  }

  if (lances.length === 0) {
    return (
      <SafeAreaView style={styles.centro}>
        <EstadoVazio
          icone="videocam-outline"
          titulo="Ainda não há lances"
          descricao="Quando atletas publicarem jogadas, elas aparecem aqui."
        />
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.tela}>
      <View style={styles.coluna} onLayout={(e) => setAlturaMedida(e.nativeEvent.layout.height)}>
        {altura > 0 ? (
          <FlatList
            data={lances}
            keyExtractor={(lance) => lance.id}
            renderItem={({ item }) => (
              <LanceTelaCheia lance={item} altura={altura} ativo={item.id === ativo} />
            )}
            // Um lance por vez, encaixando na tela ao rolar.
            pagingEnabled
            snapToInterval={altura}
            decelerationRate="fast"
            showsVerticalScrollIndicator={false}
            getItemLayout={(_, indice) => ({
              length: altura,
              offset: altura * indice,
              index: indice,
            })}
            onViewableItemsChanged={aoMudarVisiveis}
            viewabilityConfig={{ itemVisiblePercentThreshold: 80 }}
            onEndReached={() => {
              if (feed.hasNextPage && !feed.isFetchingNextPage) feed.fetchNextPage();
            }}
            onEndReachedThreshold={1}
            initialNumToRender={1}
            maxToRenderPerBatch={2}
            windowSize={3}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  coluna: {
    flex: 1,
    width: "100%",
    maxWidth: larguraMaximaConteudo,
    alignSelf: "center",
  },
  centro: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: cores.fundo,
  },
});
