import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Botao } from "@/components/ui/botao";
import { CampoTexto } from "@/components/ui/campo-texto";
import { ListaPaginada } from "@/components/ui/lista-paginada";
import { TelaLista } from "@/components/ui/tela-lista";
import { contarFiltros, type FiltrosAvaliacao } from "@/features/avaliacoes/api";
import { CardAvaliacao } from "@/features/avaliacoes/components/card-avaliacao";
import { PainelFiltros } from "@/features/avaliacoes/components/painel-filtros";
import { useAvaliacoes } from "@/features/avaliacoes/hooks";
import { useDebounce } from "@/hooks/use-debounce";
import { useLayoutResponsivo } from "@/hooks/use-layout-responsivo";
import { cores, espacamento, fonte } from "@/theme";

// Busca e filtros de avaliações (RF-23, RF-24)
export default function PesquisaAvaliacoes() {
  const router = useRouter();
  const { margemLateral } = useLayoutResponsivo();
  const [texto, setTexto] = useState("");
  const [filtros, setFiltros] = useState<FiltrosAvaliacao>({});
  const [filtrando, setFiltrando] = useState(false);
  const busca = useDebounce(texto.trim());
  const resultado = useAvaliacoes({ ...filtros, busca });
  const total = resultado.data?.pages[0]?.total;
  const filtrosAtivos = contarFiltros(filtros);

  return (
    <TelaLista>
      <View style={[styles.topo, { paddingHorizontal: margemLateral }]}>
        <CampoTexto
          semRotulo
          rotulo="Pesquisar peneiras"
          icone="search"
          placeholder="Pesquisar peneiras ou clubes"
          value={texto}
          onChangeText={setTexto}
          returnKeyType="search"
          autoCorrect={false}
        />
        <View style={styles.resumo}>
          <Text style={styles.total} accessibilityLiveRegion="polite">
            {total === undefined
              ? ""
              : `${total} ${total === 1 ? "avaliação encontrada" : "avaliações encontradas"}`}
          </Text>
          <Botao
            titulo={filtrosAtivos ? `Filtrar (${filtrosAtivos})` : "Filtrar"}
            variante="contorno"
            tamanho="compacto"
            iconeInicio="options-outline"
            onPress={() => setFiltrando(true)}
          />
        </View>
      </View>

      <ListaPaginada
        consulta={resultado}
        chave={(avaliacao) => avaliacao.id}
        renderItem={(avaliacao) => (
          <CardAvaliacao
            avaliacao={avaliacao}
            onAbrir={() =>
              router.push({ pathname: "/avaliacoes/[id]", params: { id: avaliacao.id } })
            }
          />
        )}
        vazio={{
          icone: "search-outline",
          titulo: "Nenhuma avaliação encontrada",
          descricao: "Tente outro nome ou ajuste os filtros.",
        }}
      />

      {filtrando ? (
        <PainelFiltros
          filtros={filtros}
          onFechar={() => setFiltrando(false)}
          onAplicar={(novos) => {
            setFiltros(novos);
            setFiltrando(false);
          }}
        />
      ) : null}
    </TelaLista>
  );
}

const styles = StyleSheet.create({
  topo: {
    gap: espacamento.sm,
    paddingTop: espacamento.md,
  },
  resumo: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacamento.sm,
  },
  total: {
    flex: 1,
    color: cores.textoSecundario,
    fontSize: fonte.apoio,
  },
});
