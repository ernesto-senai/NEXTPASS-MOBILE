import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Abas } from "@/components/ui/abas";
import { Avatar } from "@/components/ui/avatar";
import { ListaPaginada } from "@/components/ui/lista-paginada";
import type { SituacaoInscricao } from "@/features/avaliacoes/api";
import { CardAvaliacao } from "@/features/avaliacoes/components/card-avaliacao";
import { useAvaliacoesAbertas, useMinhasInscricoes } from "@/features/avaliacoes/hooks";
import { useLayoutResponsivo } from "@/hooks/use-layout-responsivo";
import { primeiroNome } from "@/lib/formatadores";
import { useSessao } from "@/store/sessao";
import { areaToqueMinima, cores, espacamento, fonte, larguraMaximaConteudo } from "@/theme";

type Aba = "abertas" | SituacaoInscricao;

const ABAS = [
  { chave: "abertas", rotulo: "Peneiras Abertas", rotuloCurto: "Abertas" },
  { chave: "ativas", rotulo: "Inscrições" },
  { chave: "participadas", rotulo: "Participadas" },
] as const;

// Feed com as abas Peneiras Abertas, Inscrições e Participadas (RF-18, RF-19)
export default function FeedAtleta() {
  const router = useRouter();
  const nome = useSessao((s) => s.sessao?.usuario.nome ?? "");
  const { compacto, margemLateral } = useLayoutResponsivo();
  const [aba, setAba] = useState<Aba>("abertas");
  // Carrega sempre, para o contador da aba Peneiras Abertas.
  const abertas = useAvaliacoesAbertas();

  const abrirAvaliacao = (id: string) =>
    router.push({ pathname: "/avaliacoes/[id]", params: { id } });

  return (
    <SafeAreaView style={styles.tela} edges={["top", "left", "right"]}>
      <View style={styles.coluna}>
        <View style={[styles.cabecalho, { paddingHorizontal: margemLateral }]}>
          <View style={styles.saudacao}>
            <Text
              style={[styles.titulo, { fontSize: compacto ? fonte.tituloCompacto : fonte.titulo }]}
              accessibilityRole="header"
              numberOfLines={1}
            >
              Bem-vindo, {primeiroNome(nome)} 👋
            </Text>
            <Text style={styles.subtitulo}>Confira as próximas peneiras públicas</Text>
          </View>
          <Pressable
            onPress={() => router.push("/atleta/perfil")}
            accessibilityRole="button"
            accessibilityLabel="Abrir meu perfil"
            style={styles.botaoPerfil}
          >
            <Avatar nome={nome} tamanho={compacto ? 44 : 52} />
          </Pressable>
        </View>

        <Abas
          abas={ABAS.map((a) =>
            a.chave === "abertas" ? { ...a, contador: abertas.data?.pages[0]?.total } : a,
          )}
          ativa={aba}
          onAlterar={setAba}
        />

        {aba === "abertas" ? (
          <ListaPaginada
            consulta={abertas}
            chave={(avaliacao) => avaliacao.id}
            renderItem={(avaliacao) => (
              <CardAvaliacao avaliacao={avaliacao} onAbrir={() => abrirAvaliacao(avaliacao.id)} />
            )}
            vazio={{
              icone: "football-outline",
              titulo: "Nenhuma peneira aberta por enquanto",
              descricao: "Quando olheiros publicarem novas avaliações, elas aparecem aqui.",
            }}
          />
        ) : (
          <ListaInscricoes key={aba} situacao={aba} onAbrir={abrirAvaliacao} />
        )}
      </View>
    </SafeAreaView>
  );
}

function ListaInscricoes({
  situacao,
  onAbrir,
}: {
  situacao: SituacaoInscricao;
  onAbrir: (avaliacaoId: string) => void;
}) {
  const inscricoes = useMinhasInscricoes(situacao);

  return (
    <ListaPaginada
      consulta={inscricoes}
      chave={(inscricao) => inscricao.id}
      renderItem={(inscricao) => (
        <CardAvaliacao
          avaliacao={inscricao.avaliacao}
          statusInscricao={inscricao.status}
          onAbrir={() => onAbrir(inscricao.avaliacao.id)}
        />
      )}
      vazio={
        situacao === "ativas"
          ? {
              icone: "clipboard-outline",
              titulo: "Você ainda não se inscreveu",
              descricao: "Suas inscrições em peneiras e testes aparecem aqui.",
            }
          : {
              icone: "trophy-outline",
              titulo: "Nenhuma avaliação concluída",
              descricao: "As avaliações de que você participou aparecem aqui.",
            }
      }
    />
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  coluna: {
    flex: 1,
    width: "100%",
    maxWidth: larguraMaximaConteudo,
    alignSelf: "center",
  },
  cabecalho: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingTop: espacamento.md,
    paddingBottom: 12,
  },
  saudacao: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  titulo: {
    color: cores.texto,
    fontWeight: "800",
  },
  subtitulo: {
    color: cores.textoSecundario,
    fontSize: fonte.apoio,
  },
  botaoPerfil: {
    minWidth: areaToqueMinima,
    minHeight: areaToqueMinima,
    alignItems: "center",
    justifyContent: "center",
  },
});
