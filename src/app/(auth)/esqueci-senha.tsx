import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { z } from "zod";
import { Botao } from "@/components/ui/botao";
import { CampoFormulario } from "@/components/ui/campo-formulario";
import { LinkTexto } from "@/components/ui/link-texto";
import { TelaFormulario } from "@/components/ui/tela-formulario";
import { TituloFormulario } from "@/components/ui/titulo-formulario";
import { useLayoutResponsivo } from "@/hooks/use-layout-responsivo";
import { cores, espacamento, fonte, raio } from "@/theme";

const pedidoSchema = z.object({
  email: z.string().trim().min(1, "Informe o e-mail.").pipe(z.email("Informe um e-mail válido.")),
});

type DadosPedido = z.infer<typeof pedidoSchema>;

// Tempo de "envio" mostrado no botão antes da confirmação.
const TEMPO_ENVIO_MS = 1200;

// Esqueci minha senha (RF-05). No escopo do TCC o e-mail não é enviado de
// verdade: a tela confere o e-mail digitado e mostra a confirmação do envio.
export default function EsqueciSenha() {
  const router = useRouter();
  const { espacoEntreCampos } = useLayoutResponsivo();
  const [enviando, setEnviando] = useState(false);
  const [enviadoPara, setEnviadoPara] = useState<string | null>(null);

  const { control, handleSubmit, reset } = useForm<DadosPedido>({
    resolver: zodResolver(pedidoSchema),
    defaultValues: { email: "" },
    mode: "onTouched",
  });

  const enviar = handleSubmit(async ({ email }) => {
    setEnviando(true);
    await new Promise((resolver) => setTimeout(resolver, TEMPO_ENVIO_MS));
    setEnviando(false);
    setEnviadoPara(email);
  });

  if (enviadoPara) {
    return (
      <TelaFormulario>
        <View style={[styles.conteudo, { gap: espacoEntreCampos + espacamento.sm }]}>
          <View style={styles.icone}>
            <Ionicons name="mail-open-outline" size={48} color={cores.primaria} />
          </View>
          <TituloFormulario
            inicio="Confira seu "
            destaque="e-mail"
            subtitulo="Enviamos um link para você criar uma nova senha."
          />
          <View style={styles.caixa} accessibilityLiveRegion="polite">
            <Text style={styles.textoCaixa}>Enviado para</Text>
            <Text style={styles.email}>{enviadoPara}</Text>
            <Text style={styles.textoCaixa}>
              O link vale por 1 hora. Se não encontrar, confira a caixa de spam.
            </Text>
          </View>

          <Botao
            titulo="Voltar para o login"
            iconeFim="arrow-forward"
            onPress={() => router.replace("/login")}
          />
          <View style={styles.centro}>
            <LinkTexto
              onPress={() => {
                reset({ email: enviadoPara });
                setEnviadoPara(null);
              }}
            >
              Não recebeu? Enviar de novo
            </LinkTexto>
          </View>
        </View>
      </TelaFormulario>
    );
  }

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

        <Botao
          titulo="Enviar link"
          iconeFim="paper-plane-outline"
          carregando={enviando}
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
  icone: {
    alignItems: "center",
  },
  caixa: {
    alignItems: "center",
    gap: espacamento.xs,
    padding: espacamento.md,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: raio.md,
    backgroundColor: "rgba(80, 160, 65, 0.08)",
  },
  textoCaixa: {
    color: cores.textoSecundario,
    fontSize: fonte.apoio,
    lineHeight: 20,
    textAlign: "center",
  },
  email: {
    color: cores.texto,
    fontSize: fonte.corpo,
    fontWeight: "700",
    textAlign: "center",
  },
  centro: {
    alignItems: "center",
  },
});
