import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Avatar } from "@/components/ui/avatar";
import { Aviso } from "@/components/ui/aviso";
import { Botao } from "@/components/ui/botao";
import { Carregando } from "@/components/ui/carregando";
import { Etiqueta } from "@/components/ui/etiqueta";
import { LinhaInfo } from "@/components/ui/linha-info";
import { LinkTexto } from "@/components/ui/link-texto";
import { MensagemErro, MensagemSucesso } from "@/components/ui/mensagem-erro";
import { TelaRolavel } from "@/components/ui/tela-rolavel";
import type { AvaliacaoDetalhe } from "@/features/avaliacoes/api";
import { useAlterarInscricao, useAvaliacao, useParticipar } from "@/features/avaliacoes/hooks";
import { useLayoutResponsivo } from "@/hooks/use-layout-responsivo";
import { confirmar } from "@/lib/confirmar";
import {
  formatarCategoria,
  formatarCategoriaComAnos,
  formatarData,
  formatarHora,
  formatarTaxa,
} from "@/lib/formatadores";
import { POSICOES, rotuloDe } from "@/lib/rotulos";
import { ApiError, mensagemDeErro } from "@/services/api/client";
import { useSessao } from "@/store/sessao";
import { cores, espacamento, fonte, raio } from "@/theme";

// Detalhes da avaliação e "Quero participar" (RF-20, RF-21, RN-06, RN-08)
export default function DetalhesDaAvaliacao() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const avaliacao = useAvaliacao(id);
  const usuario = useSessao((s) => s.sessao?.usuario);

  if (!avaliacao.data) {
    return <Carregando erro={avaliacao.error} onTentarDeNovo={() => avaliacao.refetch()} />;
  }
  const dados = avaliacao.data;
  const doUsuario = dados.olheiro.id === usuario?.id;

  return (
    <TelaRolavel>
      <Cabecalho avaliacao={dados} />
      <Resumo avaliacao={dados} />

      <View>
        <LinhaInfo icone="locate-outline" titulo="Posições procuradas">
          {dados.posicoes.map((posicao) => rotuloDe(POSICOES, posicao)).join(", ")}
        </LinhaInfo>
        <LinhaInfo
          icone="cash-outline"
          titulo="Preço da inscrição"
          nota={
            dados.taxaCentavos > 0
              ? "O pagamento é feito com o organizador, fora do app."
              : undefined
          }
        >
          {formatarTaxa(dados.taxaCentavos)}
        </LinhaInfo>
        <LinhaInfo icone="clipboard-outline" titulo="O que levar">
          {dados.requisitos}
        </LinhaInfo>
        <LinhaInfo icone="shirt-outline" titulo="Categoria">
          {formatarCategoriaComAnos(dados.categoria)}
        </LinhaInfo>
        <LinhaInfo icone="trending-up-outline" titulo="Tipo de avaliação">
          {dados.tipo === "TESTE" ? "Teste individual" : "Peneira"}
        </LinhaInfo>
        {/* RN-08: o endereço completo só aparece depois da confirmação. */}
        <LinhaInfo icone="map-outline" titulo="Endereço">
          {dados.endereco ?? "Aparece aqui depois que sua inscrição for confirmada."}
        </LinhaInfo>
      </View>

      {usuario?.tipo === "ATLETA" ? <AcoesDoAtleta avaliacao={dados} /> : null}

      {doUsuario ? null : (
        <View style={styles.denunciar}>
          <LinkDenuncia avaliacao={dados} />
        </View>
      )}
    </TelaRolavel>
  );
}

function Cabecalho({ avaliacao }: { avaliacao: AvaliacaoDetalhe }) {
  const { compacto } = useLayoutResponsivo();

  return (
    <View style={styles.cabecalho}>
      {/* RN-05: o clube só aparece para olheiro com vínculo comprovado. */}
      {avaliacao.clube ? (
        <Avatar nome={avaliacao.clube} tamanho={compacto ? 56 : 72} />
      ) : (
        <View style={styles.semClube}>
          <Ionicons name="football-outline" size={28} color={cores.primaria} />
        </View>
      )}
      <View style={styles.cabecalhoTextos}>
        <Text
          style={[styles.nome, { fontSize: compacto ? fonte.tituloCompacto : fonte.titulo - 2 }]}
          accessibilityRole="header"
        >
          {avaliacao.nome}
        </Text>
        <Text style={styles.detalhe}>
          {avaliacao.tipo === "TESTE" ? "Teste individual presencial" : "Avaliação presencial"}
        </Text>
        <Text style={styles.detalhe}>Olheiro responsável: {avaliacao.olheiro.nome}</Text>
        <Etiqueta texto={formatarCategoria(avaliacao.categoria)} tom="destaque" />
      </View>
    </View>
  );
}

// Data, horário, local e vagas: 2 por linha no celular, 4 em telas largas.
function Resumo({ avaliacao }: { avaliacao: AvaliacaoDetalhe }) {
  const { largo } = useLayoutResponsivo();
  const itens = [
    { icone: "calendar-outline", titulo: "Data", valor: formatarData(avaliacao.dataHora) },
    { icone: "time-outline", titulo: "Horário", valor: formatarHora(avaliacao.dataHora) },
    {
      icone: "location-outline",
      titulo: "Local",
      valor: `${avaliacao.local} – ${avaliacao.cidade}, ${avaliacao.uf}`,
    },
    {
      icone: "people-outline",
      titulo: "Vagas",
      valor: `${avaliacao.vagasOcupadas}/${avaliacao.vagas} vagas`,
    },
  ] as const;

  return (
    <View style={styles.resumo}>
      {itens.map((item) => (
        <View key={item.titulo} style={[styles.itemResumo, largo && styles.itemResumoLargo]}>
          <View style={styles.tituloResumo}>
            <Ionicons name={item.icone} size={16} color={cores.primaria} />
            <Text style={styles.rotuloResumo}>{item.titulo}</Text>
          </View>
          <Text style={styles.valorResumo}>{item.valor}</Text>
        </View>
      ))}
    </View>
  );
}

// RF-21 e RF-22: participar ou cancelar a própria inscrição.
function AcoesDoAtleta({ avaliacao }: { avaliacao: AvaliacaoDetalhe }) {
  const router = useRouter();
  const participar = useParticipar();
  const alterar = useAlterarInscricao();
  const inscricao = avaliacao.minhaInscricao;
  const ativa =
    inscricao?.status === "CONFIRMADA" || inscricao?.status === "AGUARDANDO_RESPONSAVEL";
  const encerrada =
    !["ABERTA", "ESGOTADA"].includes(avaliacao.status) ||
    new Date(avaliacao.dataHora) <= new Date();
  const erro = participar.error ?? alterar.error;
  const codigo = erro instanceof ApiError ? erro.codigo : null;

  async function cancelar() {
    if (!inscricao) return;
    const confirmou = await confirmar({
      titulo: "Cancelar inscrição?",
      mensagem: "Sua vaga fica livre para outro atleta.",
      acao: "Cancelar inscrição",
    });
    if (confirmou) alterar.mutate({ id: inscricao.id, status: "CANCELADA" });
  }

  if (encerrada) {
    return (
      <Aviso
        icone="time-outline"
        titulo="Inscrições encerradas"
        texto="Esta avaliação já aconteceu ou foi cancelada."
      />
    );
  }

  return (
    <View style={styles.acoes}>
      {inscricao?.status === "CONFIRMADA" ? (
        <MensagemSucesso mensagem="Inscrição confirmada! O endereço completo já está acima." />
      ) : null}
      {inscricao?.status === "AGUARDANDO_RESPONSAVEL" ? (
        <Aviso
          icone="people-outline"
          titulo="Aguardando seu responsável"
          texto="Como você tem menos de 18 anos, seu responsável precisa aprovar a inscrição pelo app."
        />
      ) : null}

      {erro ? <MensagemErro mensagem={mensagemDeErro(erro)} /> : null}
      {codigo === "PERFIL_INCOMPLETO" ? (
        <LinkTexto onPress={() => router.push("/atleta/editar-perfil")}>Completar perfil</LinkTexto>
      ) : null}
      {codigo === "VINCULO_PENDENTE" ? (
        <LinkTexto onPress={() => router.push("/atleta/responsavel")}>
          Indicar responsável
        </LinkTexto>
      ) : null}

      {ativa ? (
        <Botao
          titulo="Cancelar inscrição"
          variante="contorno"
          carregando={alterar.isPending}
          onPress={cancelar}
        />
      ) : (
        <Botao
          titulo={
            avaliacao.status === "ESGOTADA" ? "Vagas esgotadas" : "Quero participar da avaliação"
          }
          iconeInicio="football-outline"
          desativado={avaliacao.status === "ESGOTADA"}
          carregando={participar.isPending}
          onPress={() => participar.mutate(avaliacao.id)}
        />
      )}
    </View>
  );
}

function LinkDenuncia({ avaliacao }: { avaliacao: AvaliacaoDetalhe }) {
  const router = useRouter();
  return (
    <LinkTexto
      onPress={() =>
        router.push({
          pathname: "/denunciar",
          params: { alvoTipo: "AVALIACAO", alvoId: avaliacao.id, nome: avaliacao.nome },
        })
      }
    >
      Denunciar avaliação
    </LinkTexto>
  );
}

const styles = StyleSheet.create({
  cabecalho: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: espacamento.md,
  },
  semClube: {
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 28,
    borderWidth: 2,
    borderColor: cores.borda,
  },
  cabecalhoTextos: {
    flex: 1,
    minWidth: 0,
    gap: espacamento.xs,
  },
  nome: {
    color: cores.texto,
    fontWeight: "800",
  },
  detalhe: {
    color: cores.textoSecundario,
    fontSize: fonte.apoio,
  },
  resumo: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: espacamento.sm,
    padding: 12,
    borderRadius: raio.lg,
    backgroundColor: cores.superficie,
  },
  itemResumo: {
    flexBasis: "45%",
    flexGrow: 1,
    gap: 2,
  },
  itemResumoLargo: {
    flexBasis: "22%",
  },
  tituloResumo: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacamento.xs,
  },
  rotuloResumo: {
    color: cores.texto,
    fontSize: fonte.apoio,
    fontWeight: "700",
  },
  valorResumo: {
    color: cores.texto,
    fontSize: fonte.apoio,
  },
  acoes: {
    gap: espacamento.sm,
  },
  denunciar: {
    alignItems: "center",
  },
});
