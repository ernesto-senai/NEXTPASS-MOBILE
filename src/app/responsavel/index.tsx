import { useRouter } from "expo-router";
import type { ReactNode } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Avatar } from "@/components/ui/avatar";
import { Botao } from "@/components/ui/botao";
import { LinkTexto } from "@/components/ui/link-texto";
import { MensagemErro } from "@/components/ui/mensagem-erro";
import { TelaLista } from "@/components/ui/tela-lista";
import { TituloSecao } from "@/components/ui/titulo-secao";
import { BotaoSair } from "@/features/auth/components/botao-sair";
import type { InscricaoParaAprovar } from "@/features/avaliacoes/api";
import { ResumoAvaliacao } from "@/features/avaliacoes/components/resumo-avaliacao";
import { useAlterarInscricao, useInscricoesParaAprovar } from "@/features/avaliacoes/hooks";
import { CardConvite } from "@/features/convites/components/card-convite";
import { useConvitesRecebidos } from "@/features/convites/hooks";
import { useAtletasVinculados } from "@/features/vinculos/hooks";
import { useLayoutResponsivo } from "@/hooks/use-layout-responsivo";
import { confirmar } from "@/lib/confirmar";
import { formatarTaxa, primeiroNome } from "@/lib/formatadores";
import { mensagemDeErro } from "@/services/api/client";
import { useSessao } from "@/store/sessao";
import { cores, espacamento, fonte, raio } from "@/theme";

// Convites e inscrições dos atletas vinculados para aprovar (RF-49, RF-50)
export default function SupervisaoResponsavel() {
  const router = useRouter();
  const { compacto, margemLateral, espacoEntreCampos } = useLayoutResponsivo();
  const nome = useSessao((s) => s.sessao?.usuario.nome) ?? "";
  const atletas = useAtletasVinculados();
  const inscricoes = useInscricoesParaAprovar();
  const convites = useConvitesRecebidos();
  const alterar = useAlterarInscricao();

  const paraAprovar = inscricoes.data?.pages.flatMap((pagina) => pagina.dados) ?? [];
  const recebidos = convites.data?.pages.flatMap((pagina) => pagina.dados) ?? [];
  const atualizando = atletas.isRefetching || inscricoes.isRefetching || convites.isRefetching;

  async function recusar(inscricao: InscricaoParaAprovar) {
    const confirmou = await confirmar({
      titulo: "Recusar inscrição?",
      mensagem: `${inscricao.atleta.nome} não vai participar de ${inscricao.avaliacao.nome}.`,
      acao: "Recusar",
    });
    if (confirmou) alterar.mutate({ id: inscricao.id, status: "RECUSADA" });
  }

  return (
    <TelaLista>
      <ScrollView
        contentContainerStyle={[
          styles.conteudo,
          { paddingHorizontal: margemLateral, gap: espacoEntreCampos },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={atualizando}
            onRefresh={() => {
              atletas.refetch();
              inscricoes.refetch();
              convites.refetch();
            }}
            tintColor={cores.primaria}
            colors={[cores.primaria]}
          />
        }
      >
        <View style={styles.cabecalho}>
          <Text
            style={[styles.titulo, { fontSize: compacto ? fonte.tituloCompacto : fonte.titulo }]}
            accessibilityRole="header"
          >
            Olá, {primeiroNome(nome)}
          </Text>
          <Text style={styles.dica}>
            Você aprova as inscrições dos atletas que acompanha e vê os convites que eles recebem.
          </Text>
        </View>

        {/* RF-50 e RN-03: a inscrição do menor só confirma com a aprovação. */}
        <TituloSecao>Inscrições para aprovar</TituloSecao>
        {alterar.isError ? <MensagemErro mensagem={mensagemDeErro(alterar.error)} /> : null}
        <Secao
          carregando={inscricoes.isPending}
          erro={inscricoes.error}
          vazio={paraAprovar.length === 0}
          textoVazio="Nenhuma inscrição esperando sua aprovação."
        >
          {paraAprovar.map((inscricao) => (
            <View key={inscricao.id} style={styles.card}>
              <ResumoAvaliacao
                avaliacao={inscricao.avaliacao}
                etiqueta={{ texto: inscricao.atleta.nome, icone: "person-outline" }}
              />
              <Text style={styles.dica}>
                Preço da inscrição: {formatarTaxa(inscricao.avaliacao.taxaCentavos)}. O endereço
                completo aparece para o atleta depois da aprovação.
              </Text>
              <View style={styles.botoes}>
                <View style={styles.botao}>
                  <Botao
                    titulo="Aprovar"
                    tamanho="compacto"
                    carregando={
                      alterar.isPending &&
                      alterar.variables.id === inscricao.id &&
                      alterar.variables.status === "CONFIRMADA"
                    }
                    onPress={() => alterar.mutate({ id: inscricao.id, status: "CONFIRMADA" })}
                  />
                </View>
                <View style={styles.botao}>
                  <Botao
                    titulo="Recusar"
                    tamanho="compacto"
                    variante="contorno"
                    carregando={
                      alterar.isPending &&
                      alterar.variables.id === inscricao.id &&
                      alterar.variables.status === "RECUSADA"
                    }
                    onPress={() => recusar(inscricao)}
                  />
                </View>
              </View>
            </View>
          ))}
          {inscricoes.hasNextPage ? (
            <LinkTexto onPress={() => inscricoes.fetchNextPage()}>Ver mais inscrições</LinkTexto>
          ) : null}
        </Secao>

        <TituloSecao>Atletas vinculados</TituloSecao>
        <Secao
          carregando={atletas.isPending}
          erro={atletas.error}
          vazio={!atletas.data?.length}
          textoVazio="Nenhum atleta vinculado ainda."
        >
          {atletas.data?.map(({ vinculoId, atleta }) => (
            <View key={vinculoId} style={styles.atleta}>
              <Avatar nome={atleta.nome} fotoUrl={atleta.fotoUrl} tamanho={44} />
              <View style={styles.textos}>
                <Text style={styles.nome} numberOfLines={1}>
                  {atleta.nome}
                </Text>
                {atleta.idade === null ? null : (
                  <Text style={styles.dica}>{atleta.idade} anos</Text>
                )}
              </View>
            </View>
          ))}
        </Secao>

        {/* RF-49: cópia dos convites; quem responde é o próprio atleta. */}
        <TituloSecao>Convites recebidos</TituloSecao>
        <Secao
          carregando={convites.isPending}
          erro={convites.error}
          vazio={recebidos.length === 0}
          textoVazio="Quando um olheiro convidar um atleta vinculado, o convite aparece aqui."
        >
          {recebidos.map((convite) => (
            <CardConvite key={convite.id} convite={convite} paraResponsavel />
          ))}
          {convites.hasNextPage ? (
            <LinkTexto onPress={() => convites.fetchNextPage()}>Ver mais convites</LinkTexto>
          ) : null}
        </Secao>

        <View style={styles.conta}>
          <BotaoSair />
          <View style={styles.excluir}>
            <LinkTexto onPress={() => router.push("/excluir-conta")}>Excluir conta</LinkTexto>
          </View>
        </View>
      </ScrollView>
    </TelaLista>
  );
}

interface SecaoProps {
  carregando: boolean;
  erro: unknown;
  vazio: boolean;
  textoVazio: string;
  children: ReactNode;
}

// Estados de cada seção: carregando, erro, vazia ou com os itens.
function Secao({ carregando, erro, vazio, textoVazio, children }: SecaoProps) {
  if (carregando) return <ActivityIndicator color={cores.primaria} />;
  if (erro) return <MensagemErro mensagem={mensagemDeErro(erro)} />;
  if (vazio) return <Text style={styles.dica}>{textoVazio}</Text>;
  return <View style={styles.lista}>{children}</View>;
}

const styles = StyleSheet.create({
  conteudo: {
    paddingTop: espacamento.md,
    paddingBottom: espacamento.lg,
  },
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
  lista: {
    gap: espacamento.sm,
  },
  card: {
    gap: 12,
    padding: 12,
    borderRadius: raio.lg,
    backgroundColor: cores.superficie,
  },
  botoes: {
    flexDirection: "row",
    gap: espacamento.sm,
  },
  botao: {
    flex: 1,
    minWidth: 0,
  },
  atleta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: raio.lg,
    backgroundColor: cores.superficie,
  },
  textos: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  nome: {
    color: cores.texto,
    fontSize: fonte.corpo,
    fontWeight: "700",
  },
  conta: {
    gap: espacamento.sm,
    marginTop: espacamento.md,
  },
  excluir: {
    alignItems: "center",
  },
});
