import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { Botao } from "@/components/ui/botao";
import { CaixaSelecao } from "@/components/ui/caixa-selecao";
import { CampoTexto } from "@/components/ui/campo-texto";
import { LinkTexto } from "@/components/ui/link-texto";
import { MensagemErro } from "@/components/ui/mensagem-erro";
import { TelaFormulario } from "@/components/ui/tela-formulario";
import { MarcaNextPass } from "@/features/auth/components/marca-nextpass";
import { TituloFormulario } from "@/features/auth/components/titulo-formulario";
import { aplicarErrosDaApi, useEntrar } from "@/features/auth/hooks";
import { type DadosLogin, loginSchema } from "@/features/auth/schemas";
import { useLayoutResponsivo } from "@/hooks/use-layout-responsivo";
import { cores, espacamento, fonte } from "@/theme";

// Login com e-mail/senha ou Google, lembrar de mim e links de cadastro (RF-01 a RF-06)
export default function Login() {
  const router = useRouter();
  const { compacto, espacoEntreCampos } = useLayoutResponsivo();
  const entrar = useEntrar();
  const [erroGeral, setErroGeral] = useState<string | null>(null);

  const { control, handleSubmit, setError, setFocus } = useForm<DadosLogin>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", senha: "", lembrar: true },
    mode: "onTouched",
  });

  const enviar = handleSubmit((dados) => {
    setErroGeral(null);
    entrar.mutate(dados, {
      onError: (erro) => setErroGeral(aplicarErrosDaApi(erro, setError, ["email", "senha"])),
    });
  });

  return (
    <TelaFormulario>
      <View style={[styles.conteudo, { gap: espacoEntreCampos + espacamento.sm }]}>
        <View style={styles.cabecalho}>
          <MarcaNextPass />
          <TituloFormulario
            inicio="Bem-vindo de "
            destaque="volta!"
            subtitulo="Faça login para acessar sua conta"
          />
        </View>

        <View style={{ gap: espacoEntreCampos }}>
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
                onSubmitEditing={() => setFocus("senha")}
              />
            )}
          />
          <Controller
            control={control}
            name="senha"
            render={({ field, fieldState }) => (
              <CampoTexto
                ref={field.ref}
                senha
                rotulo="Senha"
                icone="lock-closed-outline"
                placeholder="Digite sua senha"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                erro={fieldState.error?.message}
                autoCapitalize="none"
                autoComplete="current-password"
                textContentType="password"
                returnKeyType="go"
                onSubmitEditing={enviar}
              />
            )}
          />
        </View>

        {/* Lado a lado quando cabe; empilhado em telas compactas. */}
        <View style={compacto ? styles.opcoesEmpilhadas : styles.opcoesEmLinha}>
          <Controller
            control={control}
            name="lembrar"
            render={({ field }) => (
              <CaixaSelecao
                rotulo="Lembrar de mim"
                marcada={field.value}
                onAlternar={() => field.onChange(!field.value)}
              />
            )}
          />
          <LinkTexto onPress={() => router.push("/esqueci-senha")}>Esqueceu sua senha?</LinkTexto>
        </View>

        {erroGeral ? <MensagemErro mensagem={erroGeral} /> : null}

        <Botao titulo="Entrar" iconeFim="arrow-forward" onPress={enviar} carregando={entrar.isPending} />

        <View style={styles.divisor}>
          <View style={styles.linhaDivisor} />
          <Text style={styles.textoDivisor}>ou</Text>
          <View style={styles.linhaDivisor} />
        </View>

        {/* RF-04: aguarda as credenciais do Google Cloud. */}
        <Botao
          variante="contorno"
          titulo="Entrar com Google (em breve)"
          iconeInicio="logo-google"
          desativado
          onPress={() => {}}
        />

        <View style={styles.rodape}>
          <Text style={styles.textoRodape}>Ainda não possui uma conta?</Text>
          <View style={styles.linksRodape}>
            <LinkTexto
              onPress={() => router.push({ pathname: "/cadastro", params: { perfil: "ATLETA" } })}
            >
              Criar conta como jogador
            </LinkTexto>
            <Text style={styles.textoRodape}>ou</Text>
            <LinkTexto
              onPress={() => router.push({ pathname: "/cadastro", params: { perfil: "OLHEIRO" } })}
            >
              olheiro
            </LinkTexto>
          </View>
        </View>
      </View>
    </TelaFormulario>
  );
}

const styles = StyleSheet.create({
  conteudo: {
    width: "100%",
  },
  cabecalho: {
    gap: espacamento.md,
    marginBottom: espacamento.xs,
  },
  opcoesEmLinha: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: -espacamento.sm,
  },
  opcoesEmpilhadas: {
    alignItems: "flex-start",
    marginTop: -espacamento.sm,
  },
  divisor: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacamento.sm,
  },
  linhaDivisor: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: cores.textoSecundario,
  },
  textoDivisor: {
    color: cores.textoSecundario,
    fontSize: fonte.apoio,
  },
  rodape: {
    alignItems: "center",
  },
  textoRodape: {
    color: cores.texto,
    fontSize: fonte.apoio + 1,
    textAlign: "center",
  },
  linksRodape: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    columnGap: espacamento.xs,
  },
});
