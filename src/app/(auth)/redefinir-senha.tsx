import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { Botao } from "@/components/ui/botao";
import { CampoFormulario } from "@/components/ui/campo-formulario";
import { LinkTexto } from "@/components/ui/link-texto";
import { MensagemErro } from "@/components/ui/mensagem-erro";
import { TelaFormulario } from "@/components/ui/tela-formulario";
import { TituloFormulario } from "@/components/ui/titulo-formulario";
import { usePedirNovaSenha, useRedefinirSenha } from "@/features/auth/hooks";
import { type DadosNovaSenha, novaSenhaSchema } from "@/features/auth/schemas";
import { useLayoutResponsivo } from "@/hooks/use-layout-responsivo";
import { aplicarErrosDaApi } from "@/lib/formulario";
import { ApiError, mensagemDeErro } from "@/services/api/client";
import { cores, espacamento, fonte } from "@/theme";

// RF-05: o usuário digita o código que chegou por e-mail e a nova senha. Ao trocar, a API
// encerra as sessões abertas nos outros aparelhos, e ele entra de novo pelo login.
export default function RedefinirSenha() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email?: string }>();
  const { espacoEntreCampos } = useLayoutResponsivo();
  const redefinir = useRedefinirSenha();
  const reenviar = usePedirNovaSenha();
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [concluido, setConcluido] = useState(false);

  const { control, handleSubmit, setError, setFocus } = useForm<DadosNovaSenha>({
    resolver: zodResolver(novaSenhaSchema),
    defaultValues: { codigo: "", novaSenha: "", confirmacaoSenha: "" },
    mode: "onTouched",
  });

  const enviar = handleSubmit(({ codigo, novaSenha }) => {
    setErroGeral(null);
    redefinir.mutate(
      { email: email ?? "", codigo, novaSenha },
      {
        onSuccess: () => setConcluido(true),
        onError: (erro) => {
          if (erro instanceof ApiError && erro.codigo === "CODIGO_INVALIDO") {
            setError("codigo", { message: erro.message }, { shouldFocus: true });
            return;
          }
          setErroGeral(aplicarErrosDaApi(erro, setError, ["codigo", "novaSenha"]));
        },
      },
    );
  });

  // Aberta sem o e-mail (ex.: endereço digitado direto), volta para pedir o código.
  if (!email) return <Redirect href="/esqueci-senha" />;

  if (concluido) {
    return (
      <TelaFormulario>
        <View style={[styles.conteudo, { gap: espacoEntreCampos + espacamento.sm }]}>
          <View style={styles.icone}>
            <Ionicons name="checkmark-circle-outline" size={56} color={cores.primaria} />
          </View>
          <TituloFormulario
            inicio="Senha "
            destaque="alterada"
            subtitulo="Agora é só entrar com a nova senha."
          />
          <Botao
            titulo="Ir para o login"
            iconeFim="arrow-forward"
            onPress={() => router.replace("/login")}
          />
        </View>
      </TelaFormulario>
    );
  }

  return (
    <TelaFormulario>
      <View style={[styles.conteudo, { gap: espacoEntreCampos + espacamento.sm }]}>
        <TituloFormulario
          inicio="Crie uma nova "
          destaque="senha"
          subtitulo={`Digite o código de 6 números que enviamos para ${email}. Ele vale por 15 minutos.`}
        />

        <View style={{ gap: espacoEntreCampos }}>
          <CampoFormulario
            control={control}
            nome="codigo"
            rotulo="Código"
            icone="keypad-outline"
            placeholder="000000"
            keyboardType="number-pad"
            maxLength={6}
            autoComplete="one-time-code"
            textContentType="oneTimeCode"
            returnKeyType="next"
            onSubmitEditing={() => setFocus("novaSenha")}
          />
          <CampoFormulario
            control={control}
            nome="novaSenha"
            senha
            rotulo="Nova senha"
            icone="lock-closed-outline"
            placeholder="Crie uma senha"
            autoCapitalize="none"
            autoComplete="new-password"
            textContentType="newPassword"
            returnKeyType="next"
            onSubmitEditing={() => setFocus("confirmacaoSenha")}
          />
          <CampoFormulario
            control={control}
            nome="confirmacaoSenha"
            senha
            rotulo="Confirme a nova senha"
            icone="lock-closed-outline"
            placeholder="Confirme a senha"
            autoCapitalize="none"
            autoComplete="new-password"
            textContentType="newPassword"
            returnKeyType="go"
            onSubmitEditing={() => enviar()}
          />
        </View>

        {erroGeral ? <MensagemErro mensagem={erroGeral} /> : null}
        {reenviar.isError ? <MensagemErro mensagem={mensagemDeErro(reenviar.error)} /> : null}

        <Botao
          titulo="Salvar nova senha"
          iconeFim="checkmark"
          carregando={redefinir.isPending}
          onPress={enviar}
        />

        <View style={styles.links}>
          {reenviar.isSuccess ? (
            <Text style={styles.aviso} accessibilityLiveRegion="polite">
              Enviamos um novo código. Confira também a caixa de spam.
            </Text>
          ) : (
            <LinkTexto onPress={() => reenviar.mutate(email)}>
              Não recebeu? Enviar outro código
            </LinkTexto>
          )}
          <LinkTexto onPress={() => router.replace("/login")}>Voltar para o login</LinkTexto>
        </View>
      </View>
    </TelaFormulario>
  );
}

const styles = StyleSheet.create({
  conteudo: {
    width: "100%",
  },
  icone: {
    alignItems: "center",
  },
  links: {
    alignItems: "center",
    gap: espacamento.sm,
  },
  aviso: {
    color: cores.textoSecundario,
    fontSize: fonte.apoio,
    lineHeight: 20,
    textAlign: "center",
  },
});
