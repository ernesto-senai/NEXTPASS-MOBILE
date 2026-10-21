import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { TelaLista } from "@/components/ui/tela-lista";
import { TituloFormulario } from "@/components/ui/titulo-formulario";
import { FormularioAvaliacao } from "@/features/avaliacoes/components/formulario-avaliacao";
import { useCriarAvaliacao } from "@/features/avaliacoes/hooks";
import type { DadosAvaliacao } from "@/features/avaliacoes/schemas";
import { VerificacaoPendente } from "@/features/verificacao/components/verificacao-pendente";
import { useVerificacao } from "@/features/verificacao/hooks";
import { useLayoutResponsivo } from "@/hooks/use-layout-responsivo";
import { ehOlheiroNaoVerificado } from "@/services/api/client";
import { cores, espacamento } from "@/theme";

const VALORES_INICIAIS = {
  tipo: "PENEIRA",
  nome: "",
  posicoes: [],
  requisitos: "",
  taxa: "",
  vagas: 30,
  data: "",
  hora: "",
  local: "",
  endereco: "",
  cidade: "",
  uf: "",
} as const satisfies Partial<DadosAvaliacao>;

// Cadastro de peneira ou teste (RF-41)
export default function CriarAvaliacao() {
  const { compacto, margemLateral, espacoEntreCampos } = useLayoutResponsivo();
  const verificacao = useVerificacao();
  const criar = useCriarAvaliacao();

  // RN-04: só o olheiro verificado cria avaliações.
  if (verificacao.data?.verificado === false || ehOlheiroNaoVerificado(criar.error)) {
    return <VerificacaoPendente />;
  }
  if (verificacao.isPending) {
    return (
      <TelaLista>
        <ActivityIndicator style={styles.carregando} color={cores.primaria} size="large" />
      </TelaLista>
    );
  }

  return (
    <TelaLista>
      <ScrollView
        contentContainerStyle={[
          styles.conteudo,
          { paddingHorizontal: margemLateral, gap: espacoEntreCampos },
        ]}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
      >
        <View style={styles.cabecalho}>
          {/* Ícone decorativo: some em telas compactas para priorizar o formulário. */}
          {compacto ? null : (
            <MaterialCommunityIcons name="binoculars" size={44} color={cores.primaria} />
          )}
          <TituloFormulario
            inicio="Criar "
            destaque="avaliação"
            subtitulo="Preencha os dados para abrir uma nova peneira ou teste"
          />
        </View>

        <FormularioAvaliacao
          valoresIniciais={VALORES_INICIAIS}
          textoBotao="Publicar avaliação"
          onEnviar={criar.mutateAsync}
          limparAoEnviar
          mensagemSucesso={
            criar.isSuccess ? "Avaliação publicada! Os atletas já podem se inscrever." : null
          }
        />
      </ScrollView>
    </TelaLista>
  );
}

const styles = StyleSheet.create({
  carregando: {
    flex: 1,
  },
  conteudo: {
    paddingTop: espacamento.md,
    paddingBottom: espacamento.lg,
  },
  cabecalho: {
    alignItems: "center",
    gap: espacamento.sm,
  },
});
