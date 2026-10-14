import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Botao } from "@/components/ui/botao";
import { CaixaSelecao } from "@/components/ui/caixa-selecao";
import { CampoTexto } from "@/components/ui/campo-texto";
import { Chips } from "@/components/ui/chips";
import { GrupoCampo } from "@/components/ui/grupo-campo";
import { LinkTexto } from "@/components/ui/link-texto";
import { TelaLista } from "@/components/ui/tela-lista";
import { useLayoutResponsivo } from "@/hooks/use-layout-responsivo";
import { CATEGORIAS, POSICOES, TIPOS_AVALIACAO } from "@/lib/rotulos";
import { areaToqueMinima, cores, espacamento, fonte } from "@/theme";
import type { FiltrosAvaliacao } from "../api";

const PERIODOS = [
  { valor: "7", rotulo: "Próximos 7 dias" },
  { valor: "30", rotulo: "Próximos 30 dias" },
] as const;

const ORDENS = [
  { valor: "proximas", rotulo: "Data mais próxima" },
  { valor: "recentes", rotulo: "Mais recentes" },
  { valor: "menorPreco", rotulo: "Menor preço" },
] as const;

// Escolha única: tocar de novo na opção marcada desmarca.
const alternar = <T,>(atual: T | undefined, valor: T) => (atual === valor ? undefined : valor);

interface PainelFiltrosProps {
  filtros: FiltrosAvaliacao;
  onAplicar: (filtros: FiltrosAvaliacao) => void;
  onFechar: () => void;
}

// RF-24: filtros da Pesquisa em tela cheia, como no protótipo. As mudanças só
// valem ao tocar em "Aplicar".
export function PainelFiltros({ filtros, onAplicar, onFechar }: PainelFiltrosProps) {
  const { margemLateral, espacoEntreCampos } = useLayoutResponsivo();
  const [rascunho, setRascunho] = useState(filtros);
  const [preco, setPreco] = useState(filtros.precoMax?.toString() ?? "");
  const atualizar = (mudanca: FiltrosAvaliacao) =>
    setRascunho((atual) => ({ ...atual, ...mudanca }));

  const aplicar = () => {
    const precoMax = Number(preco.replace(",", "."));
    onAplicar({ ...rascunho, precoMax: preco.trim() && precoMax >= 0 ? precoMax : undefined });
  };

  return (
    <Modal animationType="slide" onRequestClose={onFechar}>
      <TelaLista comBordaInferior>
        <View style={[styles.topo, { paddingHorizontal: margemLateral }]}>
          <Text style={styles.titulo} accessibilityRole="header">
            Filtrar
          </Text>
          <LinkTexto
            onPress={() => {
              setRascunho({});
              setPreco("");
            }}
          >
            Limpar filtros
          </LinkTexto>
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
          <GrupoCampo rotulo="Categoria">
            <Chips
              rotuloAcessivel="Categoria"
              opcoes={CATEGORIAS}
              selecionados={rascunho.categoria ? [rascunho.categoria] : []}
              onAlternar={(valor) => atualizar({ categoria: alternar(rascunho.categoria, valor) })}
            />
          </GrupoCampo>

          <GrupoCampo rotulo="Tipo de avaliação">
            <Chips
              rotuloAcessivel="Tipo de avaliação"
              opcoes={TIPOS_AVALIACAO}
              selecionados={rascunho.tipo ? [rascunho.tipo] : []}
              onAlternar={(valor) => atualizar({ tipo: alternar(rascunho.tipo, valor) })}
            />
          </GrupoCampo>

          <GrupoCampo rotulo="Data">
            <Chips
              rotuloAcessivel="Data"
              opcoes={PERIODOS}
              selecionados={rascunho.dias ? [String(rascunho.dias)] : []}
              onAlternar={(valor) => atualizar({ dias: alternar(rascunho.dias, Number(valor)) })}
            />
          </GrupoCampo>

          <CampoTexto
            rotulo="Localização"
            icone="location-outline"
            placeholder="Cidade"
            value={rascunho.cidade ?? ""}
            onChangeText={(cidade) => atualizar({ cidade })}
            autoCapitalize="words"
          />

          <CampoTexto
            rotulo="Preço máximo da inscrição"
            icone="cash-outline"
            prefixo="R$"
            placeholder="Ex.: 50"
            value={preco}
            onChangeText={setPreco}
            keyboardType="decimal-pad"
          />

          <GrupoCampo rotulo="Posições procuradas">
            <Chips
              rotuloAcessivel="Posições procuradas"
              opcoes={POSICOES}
              selecionados={rascunho.posicoes ?? []}
              onAlternar={(valor) => {
                const atuais = rascunho.posicoes ?? [];
                atualizar({
                  posicoes: atuais.includes(valor)
                    ? atuais.filter((posicao) => posicao !== valor)
                    : [...atuais, valor],
                });
              }}
            />
          </GrupoCampo>

          <GrupoCampo rotulo="Ordenar por">
            <Chips
              rotuloAcessivel="Ordenar por"
              opcoes={ORDENS}
              selecionados={[rascunho.ordenar ?? "proximas"]}
              onAlternar={(ordenar) => atualizar({ ordenar })}
            />
          </GrupoCampo>

          <CaixaSelecao
            rotulo="Mostrar apenas com vagas disponíveis"
            marcada={!!rascunho.comVagas}
            onAlternar={() => atualizar({ comVagas: !rascunho.comVagas })}
          />
        </ScrollView>

        <View style={[styles.rodape, { paddingHorizontal: margemLateral }]}>
          <Botao titulo="Aplicar" onPress={aplicar} />
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
