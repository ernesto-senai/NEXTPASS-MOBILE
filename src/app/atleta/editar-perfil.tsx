import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Botao } from "@/components/ui/botao";
import { CampoFormulario } from "@/components/ui/campo-formulario";
import { Chips } from "@/components/ui/chips";
import { GrupoCampo } from "@/components/ui/grupo-campo";
import { MensagemErro } from "@/components/ui/mensagem-erro";
import { TelaFormulario } from "@/components/ui/tela-formulario";
import { TituloFormulario } from "@/components/ui/titulo-formulario";
import type { Perfil } from "@/features/perfil/api";
import { useAtualizarPerfilAtleta, usePerfil } from "@/features/perfil/hooks";
import {
  type FormularioPerfilAtleta,
  paraDadosDoAtleta,
  perfilAtletaSchema,
  valoresDoPerfil,
} from "@/features/perfil/schemas";
import { useLayoutResponsivo } from "@/hooks/use-layout-responsivo";
import { alternarNaLista, alternarUnico } from "@/lib/filtros";
import { formatarDataDigitada, somenteDigitos } from "@/lib/formatadores";
import { aplicarErrosDaApi } from "@/lib/formulario";
import { PES_PREFERENCIAIS, POSICOES } from "@/lib/rotulos";
import { cores, espacamento } from "@/theme";

const CAMPOS_API = [
  "nome",
  "dataNascimento",
  "posicoes",
  "alturaCm",
  "pesoKg",
  "pePreferencial",
  "cidade",
  "uf",
  "nacionalidade",
] as const;

// Completar e editar o perfil técnico (RF-13, RF-14, RN-01, RN-02)
export default function EditarPerfil() {
  const perfil = usePerfil();

  // O formulário só monta com o perfil em mãos, para já abrir preenchido.
  if (!perfil.data) {
    return (
      <TelaFormulario>
        <ActivityIndicator color={cores.primaria} size="large" />
      </TelaFormulario>
    );
  }
  return <FormularioPerfil perfil={perfil.data} />;
}

function FormularioPerfil({ perfil }: { perfil: Perfil }) {
  const router = useRouter();
  const { espacoEntreCampos } = useLayoutResponsivo();
  const atualizar = useAtualizarPerfilAtleta();
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const completo = perfil.atleta?.perfilCompleto ?? false;

  const { control, handleSubmit, setError } = useForm<FormularioPerfilAtleta>({
    resolver: zodResolver(perfilAtletaSchema),
    defaultValues: valoresDoPerfil(perfil),
    mode: "onTouched",
  });

  const salvar = handleSubmit((dados) => {
    setErroGeral(null);
    atualizar.mutate(paraDadosDoAtleta(dados), {
      onSuccess: () => router.back(),
      onError: (erro) => setErroGeral(aplicarErrosDaApi(erro, setError, CAMPOS_API)),
    });
  });

  return (
    <TelaFormulario>
      <View style={{ gap: espacoEntreCampos }}>
        {/* RNF-11: o perfil do atleta só aparece para olheiros verificados. */}
        <TituloFormulario
          inicio={completo ? "Editar " : "Completar "}
          destaque="perfil"
          subtitulo="Seus dados técnicos aparecem só para olheiros verificados"
        />

        <CampoFormulario
          control={control}
          nome="nome"
          rotulo="Nome completo"
          icone="person-outline"
          autoCapitalize="words"
          maxLength={120}
        />
        <CampoFormulario
          control={control}
          nome="dataNascimento"
          rotulo="Data de nascimento"
          icone="calendar-outline"
          placeholder="DD/MM/AAAA"
          keyboardType="number-pad"
          maxLength={10}
          mascara={formatarDataDigitada}
        />

        <Controller
          control={control}
          name="posicoes"
          render={({ field, fieldState }) => (
            <GrupoCampo rotulo="Posições (até 3)" erro={fieldState.error?.message}>
              <Chips
                rotuloAcessivel="Posições"
                opcoes={POSICOES}
                selecionados={field.value}
                onAlternar={(valor) => field.onChange(alternarNaLista(field.value, valor))}
              />
            </GrupoCampo>
          )}
        />

        <View style={styles.linha}>
          <View style={styles.metade}>
            <CampoFormulario
              control={control}
              nome="alturaCm"
              rotulo="Altura (cm)"
              placeholder="174"
              keyboardType="number-pad"
              maxLength={3}
              mascara={somenteDigitos}
            />
          </View>
          <View style={styles.metade}>
            <CampoFormulario
              control={control}
              nome="pesoKg"
              rotulo="Peso (kg)"
              placeholder="68"
              keyboardType="number-pad"
              maxLength={3}
              mascara={somenteDigitos}
            />
          </View>
        </View>

        <Controller
          control={control}
          name="pePreferencial"
          render={({ field, fieldState }) => (
            <GrupoCampo rotulo="Pé preferencial" erro={fieldState.error?.message}>
              <Chips
                rotuloAcessivel="Pé preferencial"
                opcoes={PES_PREFERENCIAIS}
                selecionados={field.value ? [field.value] : []}
                onAlternar={(valor) => field.onChange(alternarUnico(field.value, valor))}
              />
            </GrupoCampo>
          )}
        />

        <View style={styles.linha}>
          <View style={styles.cidade}>
            <CampoFormulario
              control={control}
              nome="cidade"
              rotulo="Cidade"
              icone="location-outline"
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

        <CampoFormulario
          control={control}
          nome="nacionalidade"
          rotulo="Nacionalidade"
          icone="flag-outline"
          autoCapitalize="words"
          maxLength={60}
        />

        {erroGeral ? <MensagemErro mensagem={erroGeral} /> : null}
        <Botao titulo="Salvar perfil" onPress={salvar} carregando={atualizar.isPending} />
      </View>
    </TelaFormulario>
  );
}

const styles = StyleSheet.create({
  // Campos curtos lado a lado; cabem a partir de 320px.
  linha: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: espacamento.sm + 4,
  },
  metade: {
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
