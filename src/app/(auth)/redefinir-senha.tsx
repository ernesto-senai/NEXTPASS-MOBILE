import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { z } from "zod";
import { Botao } from "@/components/ui/botao";
import { CampoFormulario } from "@/components/ui/campo-formulario";
import { EstadoVazio } from "@/components/ui/estado-vazio";
import { LinkTexto } from "@/components/ui/link-texto";
import { MensagemErro, MensagemSucesso } from "@/components/ui/mensagem-erro";
import { TelaFormulario } from "@/components/ui/tela-formulario";
import { TituloFormulario } from "@/components/ui/titulo-formulario";
import { useRedefinirSenha } from "@/features/auth/hooks";
import { useLayoutResponsivo } from "@/hooks/use-layout-responsivo";
import { aplicarErrosDaApi } from "@/lib/formulario";
import { espacamento } from "@/theme";

const novaSenhaSchema = z
  .object({
    senha: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres."),
    confirmacaoSenha: z.string(),
  })
  .refine((dados) => dados.confirmacaoSenha === dados.senha, {
    path: ["confirmacaoSenha"],
    message: "As senhas não conferem.",
  });

type DadosNovaSenha = z.infer<typeof novaSenhaSchema>;

// Aberta pelo link do e-mail: nextpass://redefinir-senha?token=... (RF-05)
export default function RedefinirSenha() {
  const router = useRouter();
  const { espacoEntreCampos } = useLayoutResponsivo();
  const { token = "" } = useLocalSearchParams<{ token?: string }>();
  const redefinir = useRedefinirSenha();
  const [erroGeral, setErroGeral] = useState<string | null>(null);

  const { control, handleSubmit, setError, setFocus } = useForm<DadosNovaSenha>({
    resolver: zodResolver(novaSenhaSchema),
    defaultValues: { senha: "", confirmacaoSenha: "" },
    mode: "onTouched",
  });

  const enviar = handleSubmit(({ senha }) => {
    setErroGeral(null);
    redefinir.mutate(
      { token, senha },
      { onError: (erro) => setErroGeral(aplicarErrosDaApi(erro, setError, ["senha"])) },
    );
  });

  if (!token) {
    return (
      <TelaFormulario>
        <EstadoVazio
          icone="link-outline"
          titulo="Link inválido"
          descricao="Abra o link que chegou no seu e-mail ou peça um novo."
          acao={{ titulo: "Pedir novo link", onPress: () => router.replace("/esqueci-senha") }}
        />
      </TelaFormulario>
    );
  }

  return (
    <TelaFormulario>
      <View style={[styles.conteudo, { gap: espacoEntreCampos + espacamento.sm }]}>
        <TituloFormulario
          inicio="Nova "
          destaque="senha"
          subtitulo="Crie uma senha nova para entrar na sua conta."
        />

        {redefinir.isSuccess ? (
          <>
            <MensagemSucesso mensagem="Senha alterada! Por segurança, você saiu da conta em todos os aparelhos." />
            <Botao
              titulo="Ir para o login"
              iconeFim="arrow-forward"
              onPress={() => router.replace("/login")}
            />
          </>
        ) : (
          <>
            <View style={{ gap: espacoEntreCampos }}>
              <CampoFormulario
                control={control}
                nome="senha"
                senha
                rotulo="Nova senha"
                icone="lock-closed-outline"
                placeholder="Mínimo de 8 caracteres"
                autoCapitalize="none"
                autoComplete="new-password"
                returnKeyType="next"
                onSubmitEditing={() => setFocus("confirmacaoSenha")}
              />
              <CampoFormulario
                control={control}
                nome="confirmacaoSenha"
                senha
                rotulo="Confirme a nova senha"
                icone="lock-closed-outline"
                placeholder="Digite a senha de novo"
                autoCapitalize="none"
                autoComplete="new-password"
                returnKeyType="go"
                onSubmitEditing={enviar}
              />
            </View>

            {erroGeral ? <MensagemErro mensagem={erroGeral} /> : null}

            <Botao titulo="Salvar nova senha" carregando={redefinir.isPending} onPress={enviar} />
            <View style={styles.voltar}>
              <LinkTexto onPress={() => router.replace("/esqueci-senha")}>
                Pedir um novo link
              </LinkTexto>
            </View>
          </>
        )}
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
