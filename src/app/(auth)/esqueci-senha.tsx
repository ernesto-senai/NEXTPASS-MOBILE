import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { z } from "zod";
import { Botao } from "@/components/ui/botao";
import { CampoFormulario } from "@/components/ui/campo-formulario";
import { LinkTexto } from "@/components/ui/link-texto";
import { MensagemErro, MensagemSucesso } from "@/components/ui/mensagem-erro";
import { TelaFormulario } from "@/components/ui/tela-formulario";
import { TituloFormulario } from "@/components/ui/titulo-formulario";
import { usePedirNovaSenha } from "@/features/auth/hooks";
import { useLayoutResponsivo } from "@/hooks/use-layout-responsivo";
import { mensagemDeErro } from "@/services/api/client";
import { espacamento } from "@/theme";

const pedidoSchema = z.object({
  email: z.string().trim().min(1, "Informe o e-mail.").pipe(z.email("Informe um e-mail válido.")),
});

type DadosPedido = z.infer<typeof pedidoSchema>;

// Envia o link de redefinição por e-mail (RF-05)
export default function EsqueciSenha() {
  const router = useRouter();
  const { espacoEntreCampos } = useLayoutResponsivo();
  const pedir = usePedirNovaSenha();

  const { control, handleSubmit } = useForm<DadosPedido>({
    resolver: zodResolver(pedidoSchema),
    defaultValues: { email: "" },
    mode: "onTouched",
  });

  const enviar = handleSubmit(({ email }) => pedir.mutate(email));

  return (
    <TelaFormulario>
      <View style={[styles.conteudo, { gap: espacoEntreCampos + espacamento.sm }]}>
        <TituloFormulario
          inicio="Esqueceu sua "
          destaque="senha?"
          subtitulo="Informe o e-mail da sua conta e enviaremos um link para criar uma nova senha."
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
          onSubmitEditing={enviar}
        />

        {/* A resposta é a mesma com ou sem conta, para não revelar quem usa o app. */}
        {pedir.isSuccess ? (
          <MensagemSucesso mensagem="Se houver uma conta com esse e-mail, o link chega em instantes. Ele vale por 1 hora." />
        ) : null}
        {pedir.isError ? <MensagemErro mensagem={mensagemDeErro(pedir.error)} /> : null}

        <Botao
          titulo={pedir.isSuccess ? "Enviar de novo" : "Enviar link"}
          iconeFim="paper-plane-outline"
          carregando={pedir.isPending}
          onPress={enviar}
        />

        <View style={styles.voltar}>
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
  voltar: {
    alignItems: "center",
  },
});
