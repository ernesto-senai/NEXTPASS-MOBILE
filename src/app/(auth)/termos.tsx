import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { Botao } from "@/components/ui/botao";
import { MensagemErro } from "@/components/ui/mensagem-erro";
import { Tela } from "@/components/ui/tela";
import { useTermos } from "@/features/auth/hooks";
import { mensagemDeErro } from "@/services/api/client";
import { cores, espacamento, fonte } from "@/theme";

// Texto completo dos Termos de Uso e da Política de Privacidade (RF-10)
export default function Termos() {
  const termos = useTermos();

  return (
    <Tela titulo="Termos e privacidade">
      {termos.isPending ? <ActivityIndicator color={cores.primaria} /> : null}

      {termos.isError ? (
        <View style={styles.erro}>
          <MensagemErro mensagem={mensagemDeErro(termos.error)} />
          <Botao titulo="Tentar de novo" onPress={() => termos.refetch()} />
        </View>
      ) : null}

      {termos.data ? (
        <ScrollView contentContainerStyle={styles.conteudo}>
          <Secao titulo="Termos de Uso" itens={termos.data.termosDeUso} />
          <Secao titulo="Política de Privacidade" itens={termos.data.politicaDePrivacidade} />
          <Text style={styles.versao}>Versão {termos.data.versao}</Text>
        </ScrollView>
      ) : null}
    </Tela>
  );
}

function Secao({ titulo, itens }: { titulo: string; itens: string[] }) {
  return (
    <View style={styles.secao}>
      <Text style={styles.tituloSecao} accessibilityRole="header">
        {titulo}
      </Text>
      {itens.map((item) => (
        <Text key={item} style={styles.item}>
          • {item}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  conteudo: {
    gap: espacamento.lg,
    paddingBottom: espacamento.xl,
  },
  erro: {
    gap: espacamento.md,
  },
  secao: {
    gap: espacamento.sm,
  },
  tituloSecao: {
    color: cores.primaria,
    fontSize: fonte.corpo + 2,
    fontWeight: "700",
  },
  item: {
    color: cores.texto,
    fontSize: fonte.corpo,
    lineHeight: 24,
  },
  versao: {
    color: cores.textoSecundario,
    fontSize: fonte.apoio,
  },
});
