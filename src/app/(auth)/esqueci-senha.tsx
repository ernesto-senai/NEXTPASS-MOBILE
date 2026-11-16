import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { Botao } from "@/components/ui/botao";
import { CampoFormulario } from "@/components/ui/campo-formulario";
import { LinkTexto } from "@/components/ui/link-texto";
import { MensagemErro } from "@/components/ui/mensagem-erro";
import { TelaFormulario } from "@/components/ui/tela-formulario";
import { TituloFormulario } from "@/components/ui/titulo-formulario";
import { usePedirNovaSenha } from "@/features/auth/hooks";
import { type DadosPedidoDeSenha, pedidoDeSenhaSchema } from "@/features/auth/schemas";
import { useLayoutResponsivo } from "@/hooks/use-layout-responsivo";
import { aplicarErrosDaApi } from "@/lib/formulario";
import { espacamento } from "@/theme";

// Esqueci minha senha (RF-05): a API manda um código de 6 números para o e-mail, e a
// próxima tela usa o código para criar a nova senha.
export default function EsqueciSenha() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string }>();
  const { espacoEntreCampos } = useLayoutResponsivo();
  const pedir = usePedirNovaSenha();
  const [erroGeral, setErroGeral] = useState<string | null>(null);

  const { control, handleSubmit, setError } = useForm<DadosPedidoDeSenha>({
    resolver: zodResolver(pedidoDeSenhaSchema),
    defaultValues: { email: params.email ?? "" },
    mode: "onTouched",
  });

  const enviar = handleSubmit(({ email }) => {
    setErroGeral(null);
    pedir.mutate(email, {
      onSuccess: () => router.push({ pathname: "/redefinir-senha", params: { email } }),
      onError: (erro) => setErroGeral(aplicarErrosDaApi(erro, setError, ["email"])),
    });
  });

  return (
    <TelaFormulario>
      <View style={[styles.conteudo, { gap: espacoEntreCampos + espacamento.sm }]}>
        <TituloFormulario
          inicio="Esqueceu sua "
          destaque="senha?"
          subtitulo="Informe o e-mail da sua conta e enviaremos um código para você criar uma nova senha."
        />

        <CampoFormulario
          control={control}
          nome="email"
          rotulo="E-mail"
          icone="mail-outline"
          placeholder="Digite seu e-mail"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="send"
          onSubmitEditing={() => enviar()}
        />

        {erroGeral ? <MensagemErro mensagem={erroGeral} /> : null}

        <Botao
          titulo="Enviar código"
          iconeFim="paper-plane-outline"
          carregando={pedir.isPending}
          onPress={enviar}
        />

        <View style={styles.centro}>
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
  centro: {
    alignItems: "center",
  },
});
