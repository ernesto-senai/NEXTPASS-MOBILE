import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { z } from "zod";
import { Botao } from "@/components/ui/botao";
import { CaixaSelecao } from "@/components/ui/caixa-selecao";
import { CampoFormulario } from "@/components/ui/campo-formulario";
import { EstadoVazio } from "@/components/ui/estado-vazio";
import { LinkTexto } from "@/components/ui/link-texto";
import { MensagemErro } from "@/components/ui/mensagem-erro";
import { TelaFormulario } from "@/components/ui/tela-formulario";
import { TituloFormulario } from "@/components/ui/titulo-formulario";
import { MarcaNextPass } from "@/features/auth/components/marca-nextpass";
import type { PedidoDeVinculo } from "@/features/vinculos/api";
import { useAceitarVinculo, usePedidoDeVinculo } from "@/features/vinculos/hooks";
import { useLayoutResponsivo } from "@/hooks/use-layout-responsivo";
import { aplicarErrosDaApi } from "@/lib/formulario";
import { mensagemDeErro } from "@/services/api/client";
import { cores, espacamento, fonte, raio } from "@/theme";

// Quem já tem conta de responsável só confirma a senha; quem não tem cria a
// conta com nome, senha e o aceite dos termos (RF-10).
const aceiteSchema = z
  .object({
    contaExistente: z.boolean(),
    nome: z.string(),
    senha: z.string().min(1, "Informe a senha."),
    confirmacaoSenha: z.string(),
    aceiteTermos: z.boolean(),
  })
  .superRefine(
    (dados, ctx) => {
      if (dados.contaExistente) return;
      const erro = (campo: string, message: string) =>
        ctx.addIssue({ code: "custom", path: [campo], message });
      if (dados.nome.trim().length < 3) erro("nome", "Informe o nome completo.");
      if (dados.senha.length < 8) erro("senha", "A senha precisa ter pelo menos 8 caracteres.");
      if (dados.confirmacaoSenha !== dados.senha)
        erro("confirmacaoSenha", "As senhas não conferem.");
      if (!dados.aceiteTermos) {
        erro("aceiteTermos", "Aceite os Termos de Uso e a Política de Privacidade.");
      }
    },
    { when: () => true },
  );

type DadosAceite = z.infer<typeof aceiteSchema>;

// Responsável cria a conta pelo link do e-mail e confirma o vínculo (RF-48)
export default function ConfirmarVinculo() {
  const router = useRouter();
  const { token = "" } = useLocalSearchParams<{ token?: string }>();
  const pedido = usePedidoDeVinculo(token);

  if (token && pedido.isPending) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator color={cores.primaria} size="large" />
      </View>
    );
  }

  if (!pedido.data) {
    return (
      <View style={styles.centro}>
        <EstadoVazio
          icone="link-outline"
          titulo="Link inválido"
          descricao={
            pedido.error
              ? mensagemDeErro(pedido.error)
              : "Abra o link que chegou no seu e-mail. Se ele expirou, peça ao atleta para enviar outro."
          }
          acao={{ titulo: "Ir para o login", onPress: () => router.replace("/login") }}
        />
      </View>
    );
  }

  return <FormularioAceite token={token} pedido={pedido.data} />;
}

function FormularioAceite({ token, pedido }: { token: string; pedido: PedidoDeVinculo }) {
  const router = useRouter();
  const { espacoEntreCampos } = useLayoutResponsivo();
  const aceitar = useAceitarVinculo();
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const { contaExistente } = pedido;

  const { control, handleSubmit, setError } = useForm<DadosAceite>({
    resolver: zodResolver(aceiteSchema),
    defaultValues: {
      contaExistente,
      nome: "",
      senha: "",
      confirmacaoSenha: "",
      aceiteTermos: false,
    },
    mode: "onTouched",
  });

  const enviar = handleSubmit(({ nome, senha, aceiteTermos }) => {
    setErroGeral(null);
    aceitar.mutate(
      contaExistente ? { token, senha } : { token, senha, nome: nome.trim(), aceiteTermos },
      { onError: (erro) => setErroGeral(aplicarErrosDaApi(erro, setError, ["nome", "senha"])) },
    );
  });

  return (
    <TelaFormulario>
      <View style={[styles.conteudo, { gap: espacoEntreCampos + espacamento.xs }]}>
        <View style={styles.cabecalho}>
          <MarcaNextPass />
          <TituloFormulario
            inicio="Confirmar "
            destaque="vínculo"
            subtitulo={`${pedido.atleta.nome} indicou você como responsável no NextPass.`}
          />
        </View>

        <View style={styles.explicacao}>
          <Text style={styles.textoExplicacao}>
            Como responsável, você aprova as inscrições de {pedido.atleta.nome} nas avaliações e
            recebe uma cópia dos convites dos olheiros.
          </Text>
          <Text style={styles.email}>{pedido.emailResponsavel}</Text>
        </View>

        <View style={{ gap: espacoEntreCampos }}>
          {contaExistente ? null : (
            <CampoFormulario
              control={control}
              nome="nome"
              rotulo="Seu nome completo"
              icone="person-outline"
              placeholder="Digite seu nome"
              autoCapitalize="words"
              autoComplete="name"
            />
          )}
          <CampoFormulario
            control={control}
            nome="senha"
            senha
            rotulo={contaExistente ? "Senha da sua conta" : "Crie uma senha"}
            icone="lock-closed-outline"
            placeholder={contaExistente ? "Digite sua senha" : "Mínimo de 8 caracteres"}
            autoCapitalize="none"
            autoComplete={contaExistente ? "current-password" : "new-password"}
          />
          {contaExistente ? null : (
            <CampoFormulario
              control={control}
              nome="confirmacaoSenha"
              senha
              rotulo="Confirme a senha"
              icone="lock-closed-outline"
              placeholder="Digite a senha de novo"
              autoCapitalize="none"
              autoComplete="new-password"
            />
          )}
        </View>

        {contaExistente ? null : (
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
        )}

        {erroGeral ? <MensagemErro mensagem={erroGeral} /> : null}

        <Botao
          titulo={contaExistente ? "Confirmar vínculo" : "Criar conta e confirmar"}
          iconeFim="arrow-forward"
          carregando={aceitar.isPending}
          onPress={enviar}
        />
      </View>
    </TelaFormulario>
  );
}

const styles = StyleSheet.create({
  centro: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: cores.fundo,
  },
  conteudo: {
    width: "100%",
  },
  cabecalho: {
    gap: espacamento.md,
  },
  explicacao: {
    gap: espacamento.xs,
    padding: 12,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: raio.md,
  },
  textoExplicacao: {
    color: cores.texto,
    fontSize: fonte.apoio + 1,
    lineHeight: 21,
  },
  email: {
    color: cores.primaria,
    fontSize: fonte.apoio + 1,
    fontWeight: "700",
  },
});
