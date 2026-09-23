import { Pressable, StyleSheet, Text, View } from "react-native";
import { useLayoutResponsivo } from "@/hooks/use-layout-responsivo";
import { areaToqueMinima, cores, espacamento, fonte } from "@/theme";

interface Aba<T extends string> {
  chave: T;
  rotulo: string;
  // Rótulo para celulares (< 600px), para as abas caberem sem cortar o texto.
  rotuloCurto?: string;
  contador?: number | undefined;
}

interface AbasProps<T extends string> {
  abas: readonly Aba<T>[];
  ativa: T;
  onAlterar: (chave: T) => void;
}

// Abas de largura igual, sublinhadas em verde, como no feed do protótipo.
export function Abas<T extends string>({ abas, ativa, onAlterar }: AbasProps<T>) {
  const { largo } = useLayoutResponsivo();

  return (
    <View accessibilityRole="tablist" style={styles.barra}>
      {abas.map((aba) => {
        const selecionada = aba.chave === ativa;
        const rotulo = !largo && aba.rotuloCurto ? aba.rotuloCurto : aba.rotulo;

        return (
          <Pressable
            key={aba.chave}
            onPress={() => onAlterar(aba.chave)}
            accessibilityRole="tab"
            accessibilityState={{ selected: selecionada }}
            accessibilityLabel={aba.contador ? `${aba.rotulo}, ${aba.contador}` : aba.rotulo}
            style={[styles.aba, selecionada && styles.abaSelecionada]}
          >
            <Text
              style={[styles.rotulo, selecionada && styles.rotuloSelecionado]}
              numberOfLines={1}
            >
              {rotulo}
            </Text>
            {aba.contador ? (
              <View style={styles.contador}>
                <Text style={styles.textoContador}>{aba.contador}</Text>
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  barra: {
    flexDirection: "row",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: cores.bordaCampo,
  },
  aba: {
    flex: 1,
    minWidth: 0,
    minHeight: areaToqueMinima + 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: espacamento.xs + 2,
    paddingHorizontal: espacamento.xs,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  abaSelecionada: {
    borderBottomColor: cores.primaria,
  },
  rotulo: {
    flexShrink: 1,
    color: cores.textoSecundario,
    fontSize: fonte.apoio + 1,
    fontWeight: "600",
  },
  rotuloSelecionado: {
    color: cores.texto,
    fontWeight: "700",
  },
  contador: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: cores.primaria,
  },
  textoContador: {
    color: cores.fundo,
    fontSize: 12,
    fontWeight: "800",
  },
});
