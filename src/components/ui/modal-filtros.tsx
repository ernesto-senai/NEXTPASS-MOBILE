import { Ionicons } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLayoutResponsivo } from "@/hooks/use-layout-responsivo";
import { areaToqueMinima, cores, espacamento, fonte } from "@/theme";
import { Botao } from "./botao";
import { LinkTexto } from "./link-texto";
import { TelaLista } from "./tela-lista";

interface ModalFiltrosProps {
  children: ReactNode;
  onLimpar: () => void;
  onAplicar: () => void;
  onFechar: () => void;
}

// Moldura dos painéis "Filtrar" em tela cheia, como no protótipo: título,
// "Limpar filtros", fechar e o botão "Aplicar" fixo embaixo.
export function ModalFiltros({ children, onLimpar, onAplicar, onFechar }: ModalFiltrosProps) {
  const { margemLateral, espacoEntreCampos } = useLayoutResponsivo();

  return (
    <Modal animationType="slide" onRequestClose={onFechar}>
      <TelaLista comBordaInferior>
        <View style={[styles.topo, { paddingHorizontal: margemLateral }]}>
          <Text style={styles.titulo} accessibilityRole="header">
            Filtrar
          </Text>
          <LinkTexto onPress={onLimpar}>Limpar filtros</LinkTexto>
          <Pressable
            onPress={onFechar}
            accessibilityRole="button"
            accessibilityLabel="Fechar filtros"
            style={styles.fechar}
          >
            <Ionicons name="close" size={26} color={cores.texto} />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={[
            styles.conteudo,
            { paddingHorizontal: margemLateral, gap: espacoEntreCampos + espacamento.xs },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>

        <View style={[styles.rodape, { paddingHorizontal: margemLateral }]}>
          <Botao titulo="Aplicar" onPress={onAplicar} />
        </View>
      </TelaLista>
    </Modal>
  );
}

const styles = StyleSheet.create({
  topo: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacamento.sm,
    paddingVertical: espacamento.sm,
  },
  titulo: {
    flex: 1,
    color: cores.texto,
    fontSize: fonte.titulo,
    fontWeight: "800",
  },
  fechar: {
    width: areaToqueMinima,
    height: areaToqueMinima,
    alignItems: "center",
    justifyContent: "center",
  },
  conteudo: {
    paddingVertical: espacamento.md,
  },
  rodape: {
    paddingVertical: espacamento.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: cores.bordaCampo,
  },
});
