import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text } from "react-native";
import { BarraBusca, resumoDaBusca } from "@/components/ui/barra-busca";
import { ListaPaginada } from "@/components/ui/lista-paginada";
import { MensagemErro } from "@/components/ui/mensagem-erro";
import { TelaLista } from "@/components/ui/tela-lista";
import { TituloTela } from "@/components/ui/titulo-tela";
import type { Participante } from "@/features/avaliacoes/api";
import { ItemParticipante } from "@/features/avaliacoes/components/item-participante";
import { useAlterarInscricao, useAvaliacao, useParticipantes } from "@/features/avaliacoes/hooks";
import { VerificacaoPendente } from "@/features/verificacao/components/verificacao-pendente";
import { useDebounce } from "@/hooks/use-debounce";
import { useLayoutResponsivo } from "@/hooks/use-layout-responsivo";
import { confirmar } from "@/lib/confirmar";
import { ehOlheiroNaoVerificado, mensagemDeErro } from "@/services/api/client";
import { cores, espacamento, fonte } from "@/theme";

// Inscritos com busca, abertura de perfil e remoção (RF-44 a RF-46)
export default function Participantes() {
  const router = useRouter();
  const { margemLateral } = useLayoutResponsivo();
  const { id } = useLocalSearchParams<{ id: string }>();
  const avaliacao = useAvaliacao(id);
  const [texto, setTexto] = useState("");
  const busca = useDebounce(texto.trim());
  const participantes = useParticipantes(id, busca);
  const remover = useAlterarInscricao();

  if (ehOlheiroNaoVerificado(participantes.error)) return <VerificacaoPendente />;

  async function pedirRemocao({ id: inscricaoId, atleta }: Participante) {
    const confirmou = await confirmar({
      titulo: `Remover ${atleta.nome}?`,
      mensagem: "A vaga fica livre e o atleta recebe um aviso de que foi removido da avaliação.",
      acao: "Remover",
    });
    if (confirmou) remover.mutate({ id: inscricaoId, status: "REMOVIDA" });
  }

  return (
    <TelaLista abaixoDoCabecalho>
      <TituloTela>Participantes</TituloTela>
      {avaliacao.data ? (
        <Text style={[styles.subtitulo, { paddingHorizontal: margemLateral }]} numberOfLines={2}>
          {avaliacao.data.nome}
        </Text>
      ) : null}

      <BarraBusca
        rotulo="Pesquisar participantes"
        placeholder="Pesquisar pelo nome"
        texto={texto}
        onAlterarTexto={setTexto}
        resumo={resumoDaBusca(participantes.data?.pages[0]?.total, "participante", "participantes")}
      />

      <ListaPaginada
        consulta={participantes}
        chave={(participante) => participante.id}
        cabecalho={
          remover.isError ? <MensagemErro mensagem={mensagemDeErro(remover.error)} /> : undefined
        }
        renderItem={(participante) => (
          <ItemParticipante
            participante={participante}
            removendo={remover.isPending && remover.variables.id === participante.id}
            onRemover={() => pedirRemocao(participante)}
            onVerPerfil={() =>
              router.push({
                pathname: "/olheiro/atletas/[id]",
                params: { id: participante.atleta.id },
              })
            }
          />
        )}
        vazio={{
          icone: "people-outline",
          titulo: busca ? "Nenhum participante com esse nome" : "Ainda não há inscritos",
          descricao: busca
            ? "Confira o nome ou limpe a busca."
            : "Quando atletas se inscreverem ou aceitarem seus convites, eles aparecem aqui.",
        }}
      />
    </TelaLista>
  );
}

const styles = StyleSheet.create({
  subtitulo: {
    marginTop: espacamento.xs,
    color: cores.textoSecundario,
    fontSize: fonte.apoio + 1,
  },
});
