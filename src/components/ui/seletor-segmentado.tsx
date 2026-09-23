import { LinearGradient } from "expo-linear-gradient";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { alturaBotao, cores, espacamento, fonte, gradientePrimario, raio } from "@/theme";

interface Opcao<T extends string> {
  valor: T;
  rotulo: string;
  icone?: (cor: string) => ReactNode;
}

interface SeletorSegmentadoProps<T extends string> {
  rotuloAcessivel: string;
  opcoes: readonly Opcao<T>[];
  valor: T | undefined;
  onAlterar: (valor: T) => void;
  erro?: string | undefined;
}

// Escolha entre poucas opções lado a lado (ex.: JOGADOR | OLHEIRO). Cada opção
// ocupa metade da largura e cabe em telas de 320px.
export function SeletorSegmentado<T extends string>({
  rotuloAcessivel,
  opcoes,
  valor,
  onAlterar,
  erro,
}: SeletorSegmentadoProps<T>) {
  return (
    <View>
      <View
        accessibilityRole="radiogroup"
        accessibilityLabel={rotuloAcessivel}
        style={styles.grupo}
      >
        {opcoes.map((opcao) => {
          const ativa = opcao.valor === valor;
          const conteudo = (
            <>
              {opcao.icone?.(cores.texto)}
              <Text style={styles.rotulo} numberOfLines={1}>
                {opcao.rotulo}
              </Text>
            </>
          );

          return (
            <Pressable
              key={opcao.valor}
              onPress={() => onAlterar(opcao.valor)}
              accessibilityRole="radio"
              accessibilityState={{ checked: ativa }}
              accessibilityLabel={opcao.rotulo}
              style={[styles.opcao, !ativa && styles.opcaoInativa, !!erro && styles.opcaoComErro]}
            >
              {ativa ? (
                <LinearGradient
                  colors={gradientePrimario}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.preenchimento}
                >
                  {conteudo}
                </LinearGradient>
              ) : (
                <View style={styles.preenchimento}>{conteudo}</View>
              )}
            </Pressable>
          );
        })}
      </View>
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  grupo: {
    flexDirection: "row",
    gap: espacamento.sm,
  },
  opcao: {
    flex: 1,
    minWidth: 0,
    borderRadius: raio.md,
    overflow: "hidden",
  },
  opcaoInativa: {
    borderWidth: 1,
    borderColor: cores.bordaCampo,
    backgroundColor: cores.fundoCampo,
  },
  opcaoComErro: {
    borderColor: cores.erro,
  },
  preenchimento: {
    minHeight: alturaBotao,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: espacamento.sm,
    paddingHorizontal: espacamento.sm,
  },
  rotulo: {
    flexShrink: 1,
    color: cores.texto,
    fontSize: fonte.corpo,
    fontWeight: "700",
  },
  erro: {
    color: cores.erro,
    fontSize: fonte.apoio,
    marginTop: espacamento.xs,
  },
});
