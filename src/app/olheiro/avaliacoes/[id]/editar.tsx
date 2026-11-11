import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Carregando } from "@/components/ui/carregando";
import { TelaRolavel } from "@/components/ui/tela-rolavel";
import { FormularioAvaliacao } from "@/features/avaliacoes/components/formulario-avaliacao";
import { useAvaliacao, useEditarAvaliacao } from "@/features/avaliacoes/hooks";
import { paraDadosAvaliacao } from "@/features/avaliacoes/schemas";
import { VerificacaoPendente } from "@/features/verificacao/components/verificacao-pendente";
import { useLayoutResponsivo } from "@/hooks/use-layout-responsivo";
import { ehOlheiroNaoVerificado } from "@/services/api/client";
import { cores, espacamento, fonte } from "@/theme";

// Edição da avaliação; os inscritos são avisados da mudança (RF-43)
export default function EditarAvaliacao() {
  const router = useRouter();
  const { compacto } = useLayoutResponsivo();
  const { id } = useLocalSearchParams<{ id: string }>();
  const avaliacao = useAvaliacao(id);
  const editar = useEditarAvaliacao();

  if (ehOlheiroNaoVerificado(editar.error)) return <VerificacaoPendente />;
  if (!avaliacao.data) {
    return <Carregando erro={avaliacao.error} onTentarDeNovo={() => avaliacao.refetch()} />;
  }

  return (
    <TelaRolavel>
      <View style={styles.cabecalho}>
        <Text
          style={[styles.titulo, { fontSize: compacto ? fonte.tituloCompacto : fonte.titulo }]}
          accessibilityRole="header"
        >
          Editar avaliação
        </Text>
        <Text style={styles.dica}>
          Os atletas inscritos recebem um aviso para conferir a data, o horário e o local.
        </Text>
      </View>

      <FormularioAvaliacao
        valoresIniciais={paraDadosAvaliacao(avaliacao.data)}
        textoBotao="Salvar alterações"
        onEnviar={async (dados) => {
          await editar.mutateAsync({ id, ...dados });
          router.back();
        }}
      />
    </TelaRolavel>
  );
}

const styles = StyleSheet.create({
  cabecalho: {
    gap: espacamento.xs,
  },
  titulo: {
    color: cores.texto,
    fontWeight: "800",
  },
  dica: {
    color: cores.textoSecundario,
    fontSize: fonte.apoio,
    lineHeight: 20,
  },
});
