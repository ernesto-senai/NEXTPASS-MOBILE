import { StyleSheet, Text, View } from "react-native";
import { useLayoutResponsivo } from "@/hooks/use-layout-responsivo";
import { cores, espacamento, fonte } from "@/theme";
import { Botao } from "./botao";
import { CampoTexto } from "./campo-texto";

interface BarraBuscaProps {
  rotulo: string;
  placeholder: string;
  texto: string;
  onAlterarTexto: (texto: string) => void;
  // Ex.: "12 avaliações encontradas"; vazio enquanto carrega.
  resumo: string;
  // Sem onFiltrar (ex.: participantes), a barra mostra só a busca.
  filtrosAtivos?: number;
  onFiltrar?: (() => void) | undefined;
}

// Topo das telas de Pesquisa: campo de busca, total encontrado e "Filtrar".
export function BarraBusca({
  rotulo,
  placeholder,
  texto,
  onAlterarTexto,
  resumo,
  filtrosAtivos = 0,
  onFiltrar,
}: BarraBuscaProps) {
  const { margemLateral } = useLayoutResponsivo();

  return (
    <View style={[styles.barra, { paddingHorizontal: margemLateral }]}>
      <CampoTexto
        semRotulo
        rotulo={rotulo}
        icone="search"
        placeholder={placeholder}
        value={texto}
        onChangeText={onAlterarTexto}
        returnKeyType="search"
        autoCorrect={false}
      />
      <View style={styles.resumo}>
        <Text style={styles.total} accessibilityLiveRegion="polite">
          {resumo}
        </Text>
        {onFiltrar ? (
          <Botao
            titulo={filtrosAtivos ? `Filtrar (${filtrosAtivos})` : "Filtrar"}
            variante="contorno"
            tamanho="compacto"
            iconeInicio="options-outline"
            onPress={onFiltrar}
          />
        ) : null}
      </View>
    </View>
  );
}

// "1 atleta encontrado" / "12 atletas encontrados"; vazio enquanto carrega.
export function resumoDaBusca(total: number | undefined, singular: string, plural: string) {
  return total === undefined ? "" : `${total} ${total === 1 ? singular : plural}`;
}

const styles = StyleSheet.create({
  barra: {
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
