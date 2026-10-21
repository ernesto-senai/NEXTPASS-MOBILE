import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { z } from "zod";
import { Aviso } from "@/components/ui/aviso";
import { Botao } from "@/components/ui/botao";
import { CampoFormulario } from "@/components/ui/campo-formulario";
import { MensagemErro } from "@/components/ui/mensagem-erro";
import { TelaRolavel } from "@/components/ui/tela-rolavel";
import { useExcluirConta } from "@/features/auth/hooks";
import { useLayoutResponsivo } from "@/hooks/use-layout-responsivo";
import { confirmar } from "@/lib/confirmar";
import { ApiError, mensagemDeErro } from "@/services/api/client";
import { cores, espacamento, fonte } from "@/theme";

const exclusaoSchema = z.object({ senha: z.string().min(1, "Informe a senha.") });

type DadosExclusao = z.infer<typeof exclusaoSchema>;

// Exclusão da conta e de todos os dados, prevista na LGPD (RF-56)
export default function ExcluirConta() {
  const { compacto } = useLayoutResponsivo();
  const excluir = useExcluirConta();
  const [erroGeral, setErroGeral] = useState<string | null>(null);

  const { control, handleSubmit, setError } = useForm<DadosExclusao>({
    resolver: zodResolver(exclusaoSchema),
    defaultValues: { senha: "" },
    mode: "onTouched",
  });

  // Sem sessão, o Stack.Protected do layout raiz leva de volta para o login.
  const enviar = handleSubmit(async ({ senha }) => {
    const confirmou = await confirmar({
      titulo: "Excluir sua conta?",
      mensagem: "Todos os seus dados serão apagados de vez. Não dá para desfazer.",
      acao: "Excluir conta",
    });
    if (!confirmou) return;
    setErroGeral(null);
    excluir.mutate(senha, {
      onError: (erro) => {
        // Senha errada volta para o campo; o resto aparece em cima do botão.
        if (erro instanceof ApiError && erro.codigo === "CREDENCIAIS_INVALIDAS") {
          setError("senha", { message: erro.message }, { shouldFocus: true });
        } else {
          setErroGeral(mensagemDeErro(erro));
        }
      },
    });
  });

  return (
    <TelaRolavel>
      <View style={styles.cabecalho}>
        <Text
          style={[styles.titulo, { fontSize: compacto ? fonte.tituloCompacto : fonte.titulo }]}
          accessibilityRole="header"
        >
          Excluir conta
        </Text>
        <Text style={styles.dica}>
          Você pode excluir sua conta quando quiser. Para sair só deste aparelho, use “Sair da
          conta” no perfil.
        </Text>
      </View>

      <Aviso
        icone="warning-outline"
        titulo="Isso não pode ser desfeito"
        texto="Seu perfil, foto, lances, inscrições, convites, vínculos e documentos são apagados de vez."
      />

      <CampoFormulario
        control={control}
        nome="senha"
        senha
        rotulo="Confirme sua senha"
        icone="lock-closed-outline"
        placeholder="Digite sua senha"
        autoCapitalize="none"
        autoComplete="current-password"
        returnKeyType="go"
        onSubmitEditing={enviar}
      />

      {erroGeral ? <MensagemErro mensagem={erroGeral} /> : null}

      <Botao
        titulo="Excluir minha conta"
        iconeInicio="trash-outline"
        variante="contorno"
        carregando={excluir.isPending}
        onPress={enviar}
      />
    </TelaRolavel>
  );
}

const styles = StyleSheet.create({
  cabecalho: {
    gap: espacamento.xs,
  },
  titulo: {
    color: cores.texto,
    fontWeight: "800",
  },
  dica: {
    color: cores.textoSecundario,
    fontSize: fonte.apoio,
    lineHeight: 20,
  },
});
