import { MaterialCommunityIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { Botao } from "@/components/ui/botao";
import { CampoFormulario } from "@/components/ui/campo-formulario";
import { Chips } from "@/components/ui/chips";
import { Contador } from "@/components/ui/contador";
import { GrupoCampo } from "@/components/ui/grupo-campo";
import { MensagemErro, MensagemSucesso } from "@/components/ui/mensagem-erro";
import { SeletorSegmentado } from "@/components/ui/seletor-segmentado";
import { TelaLista } from "@/components/ui/tela-lista";
import { TituloFormulario } from "@/components/ui/titulo-formulario";
import { useCriarAvaliacao } from "@/features/avaliacoes/hooks";
import {
  avaliacaoSchema,
  type DadosAvaliacao,
  paraNovaAvaliacao,
} from "@/features/avaliacoes/schemas";
import { VerificacaoPendente } from "@/features/verificacao/components/verificacao-pendente";
import { useVerificacao } from "@/features/verificacao/hooks";
import { useLayoutResponsivo } from "@/hooks/use-layout-responsivo";
import { alternarNaLista, alternarUnico } from "@/lib/filtros";
import {
  formatarDataDigitada,
  formatarHoraDigitada,
  formatarReaisDigitados,
} from "@/lib/formatadores";
import { aplicarErrosDaApi } from "@/lib/formulario";
import { CATEGORIAS, POSICOES, TIPOS_AVALIACAO } from "@/lib/rotulos";
import { ehOlheiroNaoVerificado } from "@/services/api/client";
import { cores, espacamento } from "@/theme";

const CAMPOS_API = [
  "nome",
  "tipo",
  "categoria",
  "posicoes",
  "requisitos",
  "vagas",
  "local",
  "endereco",
  "cidade",
  "uf",
] as const;

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
  const [erroGeral, setErroGeral] = useState<string | null>(null);

  const { control, handleSubmit, setError, reset } = useForm<DadosAvaliacao>({
    resolver: zodResolver(avaliacaoSchema),
    defaultValues: VALORES_INICIAIS,
    mode: "onTouched",
  });

  const publicar = handleSubmit((dados) => {
    setErroGeral(null);
    criar.mutate(paraNovaAvaliacao(dados), {
      onSuccess: () => reset(),
      onError: (erro) => setErroGeral(aplicarErrosDaApi(erro, setError, CAMPOS_API)),
    });
  });

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

        <Controller
          control={control}
          name="tipo"
          render={({ field }) => (
            <SeletorSegmentado
              rotuloAcessivel="Tipo de avaliação"
              opcoes={TIPOS_AVALIACAO}
              valor={field.value}
              onAlterar={field.onChange}
            />
          )}
        />

        <CampoFormulario
          control={control}
          nome="nome"
          rotulo="Nome da avaliação"
          icone="trophy-outline"
          placeholder="Ex.: Peneira Sub-17"
          maxLength={80}
        />

        <Controller
          control={control}
          name="categoria"
          render={({ field, fieldState }) => (
            <GrupoCampo rotulo="Categoria" erro={fieldState.error?.message}>
              <Chips
                rotuloAcessivel="Categoria"
                opcoes={CATEGORIAS}
                selecionados={field.value ? [field.value] : []}
                onAlternar={(valor) => field.onChange(alternarUnico(field.value, valor))}
              />
            </GrupoCampo>
          )}
        />

        <Controller
          control={control}
          name="posicoes"
          render={({ field, fieldState }) => (
            <GrupoCampo rotulo="Posições procuradas" erro={fieldState.error?.message}>
              <Chips
                rotuloAcessivel="Posições procuradas"
                opcoes={POSICOES}
                selecionados={field.value}
                onAlternar={(valor) => field.onChange(alternarNaLista(field.value, valor))}
              />
            </GrupoCampo>
          )}
        />

        <CampoFormulario
          control={control}
          nome="requisitos"
          rotulo="Requisitos e materiais"
          placeholder="Ex.: Chuteira, caneleira e documento com foto"
          multiline
          maxLength={500}
        />

        {/* RN-13: a taxa só informa; o pagamento acontece fora do app. */}
        <CampoFormulario
          control={control}
          nome="taxa"
          rotulo="Preço da inscrição"
          prefixo="R$"
          placeholder="0,00 (gratuita)"
          keyboardType="number-pad"
          mascara={formatarReaisDigitados}
        />

        <Controller
          control={control}
          name="vagas"
          render={({ field, fieldState }) => (
            <GrupoCampo rotulo="Limite de vagas" erro={fieldState.error?.message}>
              <Contador
                rotulo="Limite de vagas"
                valor={field.value}
                min={1}
                max={500}
                onAlterar={field.onChange}
              />
            </GrupoCampo>
          )}
        />

        <View style={styles.linha}>
          <View style={styles.data}>
            <CampoFormulario
              control={control}
              nome="data"
              rotulo="Data"
              placeholder="DD/MM/AAAA"
              keyboardType="number-pad"
              maxLength={10}
              mascara={formatarDataDigitada}
            />
          </View>
          <View style={styles.hora}>
            <CampoFormulario
              control={control}
              nome="hora"
              rotulo="Horário"
              placeholder="HH:MM"
              keyboardType="number-pad"
              maxLength={5}
              mascara={formatarHoraDigitada}
            />
          </View>
        </View>

        <CampoFormulario
          control={control}
          nome="local"
          rotulo="Local"
          icone="business-outline"
          placeholder="Ex.: CT da Barra Funda"
          maxLength={100}
        />
        {/* RN-08: o endereço completo só aparece para os atletas confirmados. */}
        <CampoFormulario
          control={control}
          nome="endereco"
          rotulo="Endereço completo"
          icone="location-outline"
          placeholder="Rua, número e bairro"
          maxLength={200}
        />
        <View style={styles.linha}>
          <View style={styles.cidade}>
            <CampoFormulario
              control={control}
              nome="cidade"
              rotulo="Cidade"
              placeholder="Ex.: São Paulo"
              autoCapitalize="words"
              maxLength={80}
            />
          </View>
          <View style={styles.uf}>
            <CampoFormulario
              control={control}
              nome="uf"
              rotulo="UF"
              placeholder="SP"
              autoCapitalize="characters"
              maxLength={2}
              mascara={(texto) => texto.toUpperCase()}
            />
          </View>
        </View>

        {erroGeral ? <MensagemErro mensagem={erroGeral} /> : null}
        {criar.isSuccess ? (
          <MensagemSucesso mensagem="Avaliação publicada! Os atletas já podem se inscrever." />
        ) : null}

        <Botao titulo="Publicar avaliação" onPress={publicar} carregando={criar.isPending} />
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
  // Campos curtos lado a lado; cabem a partir de 320px.
  linha: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: espacamento.sm + 4,
  },
  data: {
    flex: 1.4,
    minWidth: 0,
  },
  hora: {
    flex: 1,
    minWidth: 0,
  },
  cidade: {
    flex: 1,
    minWidth: 0,
  },
  uf: {
    width: 84,
  },
});
