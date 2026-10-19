import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Abas } from "@/components/ui/abas";
import { Botao } from "@/components/ui/botao";
import { ListaPaginada } from "@/components/ui/lista-paginada";
import { MensagemErro } from "@/components/ui/mensagem-erro";
import { TelaLista } from "@/components/ui/tela-lista";
import { TituloSecao } from "@/components/ui/titulo-secao";
import { BotaoSair } from "@/features/auth/components/botao-sair";
import type { AvaliacaoResumo, SituacaoAvaliacao } from "@/features/avaliacoes/api";
import { CardMinhaAvaliacao } from "@/features/avaliacoes/components/card-minha-avaliacao";
import { useCancelarAvaliacao, useMinhasAvaliacoes } from "@/features/avaliacoes/hooks";
import { CabecalhoOlheiro } from "@/features/perfil/components/cabecalho-olheiro";
import { usePerfil } from "@/features/perfil/hooks";
import { useLayoutResponsivo } from "@/hooks/use-layout-responsivo";
import { confirmar } from "@/lib/confirmar";
import { mensagemDeErro } from "@/services/api/client";
import { espacamento } from "@/theme";

const ABAS = [
  { chave: "proximas", rotulo: "Próximas" },
  { chave: "anteriores", rotulo: "Anteriores" },
] as const;

// Perfil do olheiro e avaliações com total de inscritos (RF-42, RF-43)
export default function PerfilOlheiro() {
  const router = useRouter();
  const { espacoEntreCampos } = useLayoutResponsivo();
  const perfil = usePerfil();
  const [aba, setAba] = useState<SituacaoAvaliacao>("proximas");
  const avaliacoes = useMinhasAvaliacoes(aba);
  const cancelar = useCancelarAvaliacao();

  async function pedirCancelamento(avaliacao: AvaliacaoResumo) {
    const confirmou = await confirmar({
      titulo: "Cancelar avaliação?",
      mensagem: `${avaliacao.nome} será cancelada e os inscritos serão avisados. Não dá para desfazer.`,
      acao: "Cancelar avaliação",
    });
    if (confirmou) cancelar.mutate(avaliacao.id);
  }

  return (
    <TelaLista>
      <ListaPaginada
        consulta={avaliacoes}
        chave={(avaliacao) => avaliacao.id}
        renderItem={(avaliacao) => (
          <CardMinhaAvaliacao
            avaliacao={avaliacao}
            onVerParticipantes={() =>
              router.push({
                pathname: "/olheiro/avaliacoes/[id]/participantes",
                params: { id: avaliacao.id },
              })
            }
            onCancelar={aba === "proximas" ? () => pedirCancelamento(avaliacao) : undefined}
            cancelando={cancelar.isPending && cancelar.variables === avaliacao.id}
          />
        )}
        cabecalho={
          <View style={[styles.cabecalho, { gap: espacoEntreCampos }]}>
            {perfil.data ? <CabecalhoOlheiro perfil={perfil.data} /> : null}
            <Botao
              titulo="Criar avaliação"
              iconeInicio="add"
              onPress={() => router.push("/olheiro/publicar")}
            />
            <TituloSecao>Minhas avaliações</TituloSecao>
            {cancelar.isError ? <MensagemErro mensagem={mensagemDeErro(cancelar.error)} /> : null}
            <Abas abas={ABAS} ativa={aba} onAlterar={setAba} />
          </View>
        }
        rodape={
          <View style={styles.sair}>
            <BotaoSair />
          </View>
        }
        vazio={
          aba === "proximas"
            ? {
                icone: "clipboard-outline",
                titulo: "Nenhuma avaliação marcada",
                descricao: "Crie uma peneira ou teste para os atletas se inscreverem.",
              }
            : {
                icone: "time-outline",
                titulo: "Nenhuma avaliação anterior",
                descricao: "As avaliações que já aconteceram ou foram canceladas aparecem aqui.",
              }
        }
      />
    </TelaLista>
  );
}

const styles = StyleSheet.create({
  cabecalho: {
    marginBottom: espacamento.md,
  },
  sair: {
    marginTop: espacamento.lg,
  },
});
