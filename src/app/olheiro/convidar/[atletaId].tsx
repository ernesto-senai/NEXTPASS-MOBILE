import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { Botao } from "@/components/ui/botao";
import { CampoTexto } from "@/components/ui/campo-texto";
import { EstadoVazio } from "@/components/ui/estado-vazio";
import { LinkTexto } from "@/components/ui/link-texto";
import { MensagemErro, MensagemSucesso } from "@/components/ui/mensagem-erro";
import { TelaRolavel } from "@/components/ui/tela-rolavel";
import { TituloSecao } from "@/components/ui/titulo-secao";
import type { AvaliacaoResumo } from "@/features/avaliacoes/api";
import { ResumoAvaliacao } from "@/features/avaliacoes/components/resumo-avaliacao";
import { useMinhasAvaliacoes } from "@/features/avaliacoes/hooks";
import { useAtleta } from "@/features/atletas/hooks";
import { TAMANHO_MAXIMO_MENSAGEM } from "@/features/convites/api";
import { useEnviarConvite } from "@/features/convites/hooks";
import { VerificacaoPendente } from "@/features/verificacao/components/verificacao-pendente";
import { useLayoutResponsivo } from "@/hooks/use-layout-responsivo";
import { primeiroNome } from "@/lib/formatadores";
import { ehOlheiroNaoVerificado, mensagemDeErro } from "@/services/api/client";
import { cores, espacamento, fonte, raio } from "@/theme";

// RN-11: só as avaliações do próprio olheiro, abertas e ainda por acontecer.
const aceitaConvite = (avaliacao: AvaliacaoResumo) =>
  avaliacao.status === "ABERTA" && new Date(avaliacao.dataHora) > new Date();

// Escolha da avaliação e mensagem de até 300 caracteres (RF-39, RF-40, RN-10)
export default function ChamarParaAvaliacao() {
  const router = useRouter();
  const { compacto } = useLayoutResponsivo();
  const { atletaId } = useLocalSearchParams<{ atletaId: string }>();
  const atleta = useAtleta(atletaId);
  const minhas = useMinhasAvaliacoes("proximas");
  const enviar = useEnviarConvite();
  const [avaliacaoId, setAvaliacaoId] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState<string | null>(null);

  const nome = atleta.data?.nome ?? "o atleta";
  const abertas = (minhas.data?.pages.flatMap((pagina) => pagina.dados) ?? []).filter(
    aceitaConvite,
  );

  if (ehOlheiroNaoVerificado(minhas.error)) return <VerificacaoPendente />;

  if (enviar.data) {
    return (
      <TelaRolavel>
        <MensagemSucesso
          mensagem={`Convite enviado! ${primeiroNome(nome)} vai ver o convite para ${enviar.data.avaliacao.nome} na caixa de convites.`}
        />
        {enviar.data.copiaResponsavel ? (
          <Text style={styles.dica}>
            Como o atleta tem menos de 18 anos, o responsável dele também recebeu uma cópia.
          </Text>
        ) : null}
        <Botao titulo="Voltar" variante="contorno" onPress={() => router.back()} />
      </TelaRolavel>
    );
  }

  function enviarConvite() {
    if (!avaliacaoId) return setErro("Escolha a avaliação para a qual quer chamar o atleta.");
    if (!mensagem.trim()) return setErro("Escreva uma mensagem para o atleta.");
    setErro(null);
    enviar.mutate({ atletaId, avaliacaoId, mensagem: mensagem.trim() });
  }

  return (
    <TelaRolavel>
      <View style={styles.cabecalho}>
        <Text
          style={[styles.titulo, { fontSize: compacto ? fonte.tituloCompacto : fonte.titulo }]}
          accessibilityRole="header"
        >
          Chamar para avaliação
        </Text>
        <Text style={styles.dica}>
          Escolha uma das suas avaliações abertas e mande uma mensagem para {nome}.
        </Text>
      </View>

      <TituloSecao>Avaliação</TituloSecao>
      {minhas.isPending ? <ActivityIndicator color={cores.primaria} /> : null}
      {minhas.isError ? <MensagemErro mensagem={mensagemDeErro(minhas.error)} /> : null}
      {minhas.data && abertas.length === 0 ? (
        <EstadoVazio
          icone="calendar-outline"
          titulo="Nenhuma avaliação aberta"
          descricao="Crie uma avaliação para poder convidar atletas."
          acao={{ titulo: "Criar avaliação", onPress: () => router.push("/olheiro/publicar") }}
        />
      ) : null}
      <View style={styles.opcoes} accessibilityRole="radiogroup">
        {abertas.map((avaliacao) => (
          <OpcaoAvaliacao
            key={avaliacao.id}
            avaliacao={avaliacao}
            escolhida={avaliacao.id === avaliacaoId}
            onEscolher={() => setAvaliacaoId(avaliacao.id)}
          />
        ))}
      </View>
      {minhas.hasNextPage ? (
        <LinkTexto onPress={() => minhas.fetchNextPage()}>Ver mais avaliações</LinkTexto>
      ) : null}

      <View>
        <CampoTexto
          rotulo="Mensagem"
          placeholder="Ex.: Gostei dos seus lances. Venha fazer um teste com a gente!"
          value={mensagem}
          onChangeText={setMensagem}
          multiline
          maxLength={TAMANHO_MAXIMO_MENSAGEM}
        />
        <Text style={styles.contador} accessibilityLiveRegion="polite">
          {mensagem.length}/{TAMANHO_MAXIMO_MENSAGEM}
        </Text>
      </View>

      {erro || enviar.error ? (
        <MensagemErro mensagem={erro ?? mensagemDeErro(enviar.error)} />
      ) : null}

      <Botao
        titulo="Enviar convite"
        iconeInicio="paper-plane-outline"
        carregando={enviar.isPending}
        desativado={abertas.length === 0}
        onPress={enviarConvite}
      />
    </TelaRolavel>
  );
}

interface OpcaoAvaliacaoProps {
  avaliacao: AvaliacaoResumo;
  escolhida: boolean;
  onEscolher: () => void;
}

function OpcaoAvaliacao({ avaliacao, escolhida, onEscolher }: OpcaoAvaliacaoProps) {
  const livres = avaliacao.vagas - avaliacao.vagasOcupadas;

  return (
    <Pressable
      onPress={onEscolher}
      accessibilityRole="radio"
      aria-checked={escolhida}
      accessibilityLabel={avaliacao.nome}
      style={[styles.opcao, escolhida && styles.opcaoEscolhida]}
    >
      <ResumoAvaliacao avaliacao={avaliacao} />
      <Text style={styles.vagas}>
        {livres} {livres === 1 ? "vaga livre" : "vagas livres"}
      </Text>
    </Pressable>
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
  opcoes: {
    gap: espacamento.sm,
  },
  opcao: {
    gap: espacamento.sm,
    padding: 12,
    borderWidth: 2,
    borderColor: cores.bordaCampo,
    borderRadius: raio.lg,
    backgroundColor: cores.superficie,
  },
  opcaoEscolhida: {
    borderColor: cores.primaria,
  },
  vagas: {
    color: cores.primaria,
    fontSize: fonte.apoio,
    fontWeight: "700",
    textAlign: "right",
  },
  contador: {
    marginTop: espacamento.xs,
    color: cores.textoSecundario,
    fontSize: fonte.rotulo,
    textAlign: "right",
  },
});
