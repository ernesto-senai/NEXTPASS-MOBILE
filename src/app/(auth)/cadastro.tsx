import { MaterialCommunityIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { Botao } from "@/components/ui/botao";
import { CaixaSelecao } from "@/components/ui/caixa-selecao";
import { CampoTexto } from "@/components/ui/campo-texto";
import { LinkTexto } from "@/components/ui/link-texto";
import { MensagemErro } from "@/components/ui/mensagem-erro";
import { SeletorSegmentado } from "@/components/ui/seletor-segmentado";
import { TelaFormulario } from "@/components/ui/tela-formulario";
import { TituloFormulario } from "@/features/auth/components/titulo-formulario";
import { aplicarErrosDaApi, useCadastrar } from "@/features/auth/hooks";
import { cadastroSchema, type DadosCadastro } from "@/features/auth/schemas";
import { useLayoutResponsivo } from "@/hooks/use-layout-responsivo";
import { formatarTelefone } from "@/lib/formatadores";
import { cores, espacamento, fonte } from "@/theme";

const PERFIS = [
  {
    valor: "ATLETA",
    rotulo: "JOGADOR",
    icone: (cor: string) => <MaterialCommunityIcons name="soccer" size={22} color={cor} />,
  },
  {
    valor: "OLHEIRO",
    rotulo: "OLHEIRO",
    icone: (cor: string) => <MaterialCommunityIcons name="binoculars" size={22} color={cor} />,
  },
] as const;

const ATUACOES = [
  { valor: "CLUBE", rotulo: "Clube" },
  { valor: "INDEPENDENTE", rotulo: "Independente" },
] as const;

const CAMPOS_API = ["nome", "email", "telefone", "atuacao", "clube", "senha", "aceiteTermos"] as const;

// Criar conta com abas Jogador e Olheiro e aceite dos termos (RF-07 a RF-11)
export default function Cadastro() {
  const router = useRouter();
  const params = useLocalSearchParams<{ perfil?: string }>();
  const { compacto, espacoEntreCampos } = useLayoutResponsivo();
  const cadastrar = useCadastrar();
  const [erroGeral, setErroGeral] = useState<string | null>(null);

  const { control, handleSubmit, setError, setFocus } = useForm<DadosCadastro>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: {
      perfil: params.perfil === "OLHEIRO" ? "OLHEIRO" : "ATLETA",
      nome: "",
      email: "",
      telefone: "",
      atuacao: undefined,
      clube: "",
      senha: "",
      confirmacaoSenha: "",
      aceiteTermos: false,
    },
    mode: "onTouched",
  });
  const perfil = useWatch({ control, name: "perfil" });
  const atuacao = useWatch({ control, name: "atuacao" });
  const ehOlheiro = perfil === "OLHEIRO";

  const enviar = handleSubmit((dados) => {
    setErroGeral(null);
    cadastrar.mutate(dados, {
      onError: (erro) => setErroGeral(aplicarErrosDaApi(erro, setError, CAMPOS_API)),
    });
  });

  return (
    <TelaFormulario>
      <View style={{ gap: espacoEntreCampos + espacamento.xs }}>
        <View style={styles.cabecalho}>
          {/* Ícone decorativo: some em telas compactas para priorizar o formulário. */}
          {compacto ? null : (
            <View style={styles.icone}>
              <MaterialCommunityIcons name="account-plus" size={36} color={cores.primaria} />
            </View>
          )}
          <TituloFormulario
            inicio="CRIAR "
            destaque="CONTA"
            subtitulo="Preencha os dados abaixo para se cadastrar"
          />
        </View>

        <Controller
          control={control}
          name="perfil"
          render={({ field }) => (
            <SeletorSegmentado
              rotuloAcessivel="Tipo de conta"
              opcoes={PERFIS}
              valor={field.value}
              onAlterar={field.onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="nome"
          render={({ field, fieldState }) => (
            <CampoTexto
              ref={field.ref}
              rotulo="Nome completo"
              icone="person-outline"
              placeholder="Digite seu nome completo"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              erro={fieldState.error?.message}
              autoCapitalize="words"
              autoComplete="name"
              textContentType="name"
              returnKeyType="next"
              onSubmitEditing={() => setFocus("email")}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field, fieldState }) => (
            <CampoTexto
              ref={field.ref}
              rotulo="E-mail"
              icone="mail-outline"
              placeholder="Digite seu e-mail"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              erro={fieldState.error?.message}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="next"
              onSubmitEditing={() => setFocus(ehOlheiro ? "telefone" : "senha")}
            />
          )}
        />

        {/* No protótipo, e-mail e telefone ficam lado a lado. Aqui ficam
            empilhados em qualquer largura: lado a lado, o telefone ficava com
            menos de 100px dentro do cartão de 440px e cortava a máscara. */}
        {ehOlheiro ? (
          <Controller
            control={control}
            name="telefone"
            render={({ field, fieldState }) => (
              <CampoTexto
                ref={field.ref}
                rotulo="Telefone"
                icone="call-outline"
                prefixo="+55"
                placeholder="(00) 00000-0000"
                value={field.value}
                onChangeText={(valor) => field.onChange(formatarTelefone(valor))}
                onBlur={field.onBlur}
                erro={fieldState.error?.message}
                keyboardType="phone-pad"
                autoComplete="tel-national"
                textContentType="telephoneNumber"
                maxLength={15}
              />
            )}
          />
        ) : null}

        {ehOlheiro ? (
          <View style={{ gap: espacoEntreCampos }}>
            <View>
              <Text style={styles.rotulo}>Atuação</Text>
              <Controller
                control={control}
                name="atuacao"
                render={({ field, fieldState }) => (
                  <SeletorSegmentado
                    rotuloAcessivel="Atuação"
                    opcoes={ATUACOES}
                    valor={field.value}
                    onAlterar={field.onChange}
                    erro={fieldState.error?.message}
                  />
                )}
              />
            </View>
            {atuacao === "CLUBE" ? (
              <Controller
                control={control}
                name="clube"
                render={({ field, fieldState }) => (
                  <CampoTexto
                    ref={field.ref}
                    rotulo="Clube"
                    icone="shield-outline"
                    placeholder="Nome do clube"
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    erro={fieldState.error?.message}
                    autoCapitalize="words"
                  />
                )}
              />
            ) : null}
          </View>
        ) : null}

        <Controller
          control={control}
          name="senha"
          render={({ field, fieldState }) => (
            <CampoTexto
              ref={field.ref}
              senha
              rotulo="Senha"
              icone="lock-closed-outline"
              placeholder="Crie uma senha"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              erro={fieldState.error?.message}
              autoCapitalize="none"
              autoComplete="new-password"
              textContentType="newPassword"
              returnKeyType="next"
              onSubmitEditing={() => setFocus("confirmacaoSenha")}
            />
          )}
        />
        <Controller
          control={control}
          name="confirmacaoSenha"
          render={({ field, fieldState }) => (
            <CampoTexto
              ref={field.ref}
              senha
              rotulo="Confirme a senha"
              icone="lock-closed-outline"
              placeholder="Confirme sua senha"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              erro={fieldState.error?.message}
              autoCapitalize="none"
              autoComplete="new-password"
              textContentType="newPassword"
            />
          )}
        />

        <View>
          <Controller
            control={control}
            name="aceiteTermos"
            render={({ field, fieldState }) => (
              <CaixaSelecao
                rotulo="Aceito os Termos de Uso e a Política de Privacidade"
                marcada={field.value}
                onAlternar={() => field.onChange(!field.value)}
                erro={fieldState.error?.message}
              />
            )}
          />
          <LinkTexto onPress={() => router.push("/termos")}>
            Ler os Termos de Uso e a Política de Privacidade
          </LinkTexto>
        </View>

        {erroGeral ? <MensagemErro mensagem={erroGeral} /> : null}

        <Botao titulo="Criar conta" onPress={enviar} carregando={cadastrar.isPending} />

        <View style={styles.rodape}>
          <Text style={styles.textoRodape}>Já possui uma conta?</Text>
          <LinkTexto onPress={() => router.replace("/login")}>Fazer login</LinkTexto>
        </View>
      </View>
    </TelaFormulario>
  );
}

const styles = StyleSheet.create({
  cabecalho: {
    alignItems: "center",
    gap: espacamento.sm,
  },
  icone: {
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 32,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  rotulo: {
    color: cores.primaria,
    fontSize: fonte.rotulo,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  rodape: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    columnGap: espacamento.xs,
  },
  textoRodape: {
    color: cores.texto,
    fontSize: fonte.apoio + 1,
  },
});
