import type { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";
import type { ComponentProps, ReactElement } from "react";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { useLayoutResponsivo } from "@/hooks/use-layout-responsivo";
import { mensagemDeErro } from "@/services/api/client";
import { cores, espacamento } from "@/theme";
import type { Pagina } from "@/types/api";
import { EstadoVazio } from "./estado-vazio";

interface ListaPaginadaProps<T> {
  consulta: UseInfiniteQueryResult<InfiniteData<Pagina<T>>>;
  chave: (item: T) => string;
  renderItem: (item: T) => ReactElement;
  vazio: ComponentProps<typeof EstadoVazio>;
}

// Lista de uma rota paginada (RNF-02): carrega mais ao chegar no fim, atualiza
// ao puxar para baixo e mostra os estados de carregando, erro e vazio.
export function ListaPaginada<T>({ consulta, chave, renderItem, vazio }: ListaPaginadaProps<T>) {
  const { margemLateral, espacoEntreCampos } = useLayoutResponsivo();

  if (consulta.isPending) {
    return <ActivityIndicator style={styles.carregando} color={cores.primaria} size="large" />;
  }

  if (consulta.isError) {
    return (
      <EstadoVazio
        icone="cloud-offline-outline"
        titulo="Não foi possível carregar"
        descricao={mensagemDeErro(consulta.error)}
        acao={{ titulo: "Tentar de novo", onPress: () => consulta.refetch() }}
      />
    );
  }

  const itens = consulta.data.pages.flatMap((pagina) => pagina.dados);

  return (
    <FlatList
      data={itens}
      keyExtractor={chave}
      renderItem={({ item }) => renderItem(item)}
      contentContainerStyle={[
        styles.conteudo,
        { paddingHorizontal: margemLateral, paddingVertical: espacoEntreCampos },
      ]}
      ItemSeparatorComponent={() => <View style={{ height: espacoEntreCampos }} />}
      ListEmptyComponent={<EstadoVazio {...vazio} />}
      ListFooterComponent={
        consulta.isFetchingNextPage ? <ActivityIndicator color={cores.primaria} /> : null
      }
      onEndReached={() => {
        if (consulta.hasNextPage && !consulta.isFetchingNextPage) consulta.fetchNextPage();
      }}
      onEndReachedThreshold={0.5}
      refreshControl={
        <RefreshControl
          refreshing={consulta.isRefetching && !consulta.isFetchingNextPage}
          onRefresh={() => consulta.refetch()}
          tintColor={cores.primaria}
          colors={[cores.primaria]}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  carregando: {
    marginTop: espacamento.xl,
  },
  conteudo: {
    flexGrow: 1,
  },
});
