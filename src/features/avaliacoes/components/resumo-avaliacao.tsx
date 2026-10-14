import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps, ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Avatar } from "@/components/ui/avatar";
import { Etiqueta } from "@/components/ui/etiqueta";
import { useLayoutResponsivo } from "@/hooks/use-layout-responsivo";
import { formatarCategoria, formatarData, formatarHora } from "@/lib/formatadores";
import { cores, fonte } from "@/theme";
import type { AvaliacaoResumo } from "../api";

interface ResumoAvaliacaoProps {
  avaliacao: AvaliacaoResumo;
  // Status ao lado da categoria (ex.: situação da inscrição ou do convite).
  etiqueta?: ComponentProps<typeof Etiqueta> | undefined;
  // No convite, o atleta vê quem o chamou.
  mostrarOlheiro?: boolean;
}

// Topo dos cards de avaliação e de convite: escudo, nome, etiquetas, data e local.
export function ResumoAvaliacao({
  avaliacao,
  etiqueta,
  mostrarOlheiro = false,
}: ResumoAvaliacaoProps) {
  const { compacto } = useLayoutResponsivo();

  return (
    <View style={styles.topo}>
      {/* RN-05: o clube só aparece para olheiro com vínculo comprovado. */}
      {avaliacao.clube ? (
        <Avatar nome={avaliacao.clube} tamanho={compacto ? 44 : 56} />
      ) : (
        <View style={[styles.semClube, compacto && styles.semClubeCompacto]}>
          <Ionicons name="football-outline" size={compacto ? 22 : 26} color={cores.primaria} />
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.nome} numberOfLines={2} accessibilityRole="header">
          {avaliacao.nome}
        </Text>
        <View style={styles.etiquetas}>
          <Etiqueta texto={formatarCategoria(avaliacao.categoria)} tom="destaque" />
          {avaliacao.tipo === "TESTE" ? <Etiqueta texto="Teste individual" /> : null}
          {etiqueta ? <Etiqueta {...etiqueta} /> : null}
        </View>
        <Linha icone="calendar-outline">
          {formatarData(avaliacao.dataHora)} · {formatarHora(avaliacao.dataHora)}
        </Linha>
        <Linha icone="location-outline">
          {avaliacao.local} – {avaliacao.cidade}, {avaliacao.uf}
        </Linha>
        {mostrarOlheiro ? (
          <Linha icone="person-outline">Olheiro: {avaliacao.olheiro.nome}</Linha>
        ) : null}
      </View>
    </View>
  );
}

function Linha({
  icone,
  children,
}: {
  icone: ComponentProps<typeof Ionicons>["name"];
  children: ReactNode;
}) {
  return (
    <View style={styles.linha}>
      <Ionicons name={icone} size={16} color={cores.primaria} style={styles.iconeLinha} />
      <Text style={styles.textoLinha} numberOfLines={2}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  topo: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  semClube: {
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 28,
    borderWidth: 2,
    borderColor: cores.borda,
  },
  semClubeCompacto: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  info: {
    flex: 1,
    minWidth: 0,
    gap: 6,
  },
  nome: {
    color: cores.texto,
    fontSize: fonte.corpo + 1,
    fontWeight: "800",
  },
  etiquetas: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  linha: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
  },
  iconeLinha: {
    marginTop: 1,
  },
  textoLinha: {
    flex: 1,
    color: cores.texto,
    fontSize: fonte.apoio,
    lineHeight: 19,
  },
});
