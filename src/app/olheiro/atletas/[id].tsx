import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { Botao } from "@/components/ui/botao";
import { Carregando } from "@/components/ui/carregando";
import { LinkTexto } from "@/components/ui/link-texto";
import { TelaRolavel } from "@/components/ui/tela-rolavel";
import { TituloSecao } from "@/components/ui/titulo-secao";
import type { AtletaDetalhe } from "@/features/atletas/api";
import { CartaoAtleta } from "@/features/atletas/components/cartao-atleta";
import { MapaDePosicoes } from "@/features/atletas/components/mapa-de-posicoes";
import { useAtleta } from "@/features/atletas/hooks";
import { CarrosselLances } from "@/features/lances/components/carrossel-lances";
import { VerificacaoPendente } from "@/features/verificacao/components/verificacao-pendente";
import { useLayoutResponsivo } from "@/hooks/use-layout-responsivo";
import { formatarAltura, formatarCategoria } from "@/lib/formatadores";
import { PES_PREFERENCIAIS, POSICOES, rotuloDe } from "@/lib/rotulos";
import { ehOlheiroNaoVerificado } from "@/services/api/client";
import { cores, fonte, larguraMaximaConteudo } from "@/theme";

// Ficha técnica, mapa de posições e lances em destaque (RF-38, RF-45)
export default function PerfilAtletaVisaoOlheiro() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const atleta = useAtleta(id);

  if (ehOlheiroNaoVerificado(atleta.error)) return <VerificacaoPendente />;
  if (!atleta.data) {
    return <Carregando erro={atleta.error} onTentarDeNovo={() => atleta.refetch()} />;
  }

  return <Perfil atleta={atleta.data} />;
}

function Perfil({ atleta }: { atleta: AtletaDetalhe }) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { margemLateral } = useLayoutResponsivo();
  const largura = Math.min(width, larguraMaximaConteudo) - 2 * margemLateral;
  const posicoes = atleta.posicoes.map((posicao) => rotuloDe(POSICOES, posicao)).join(", ");
  const local = [atleta.cidade, atleta.uf].filter(Boolean).join(", ");

  return (
    <TelaRolavel>
      <CartaoAtleta
        nome={atleta.nome}
        fotoUrl={atleta.fotoUrl}
        detalhes={[posicoes, `${atleta.idade} anos · ${local} · ${atleta.nacionalidade}`]}
        ficha={[
          { rotulo: "Categoria", valor: formatarCategoria(atleta.categoria) },
          { rotulo: "Altura", valor: formatarAltura(atleta.alturaCm) },
          { rotulo: "Peso", valor: `${atleta.pesoKg} kg` },
          { rotulo: "Pé", valor: rotuloDe(PES_PREFERENCIAIS, atleta.pePreferencial) },
        ]}
      />

      {/* RF-39: convite para uma avaliação própria e aberta (RN-11). */}
      <Botao
        titulo="Chamar para avaliação"
        iconeInicio="paper-plane-outline"
        onPress={() =>
          router.push({ pathname: "/olheiro/convidar/[atletaId]", params: { atletaId: atleta.id } })
        }
      />

      <TituloSecao>Posições em campo</TituloSecao>
      <MapaDePosicoes posicoes={atleta.posicoes} />

      <TituloSecao>Lances em destaque</TituloSecao>
      {atleta.lances.length > 0 ? (
        <CarrosselLances lances={atleta.lances} largura={largura} />
      ) : (
        <Text style={styles.dica}>Este atleta ainda não publicou lances.</Text>
      )}
      {atleta.totalLances > atleta.lances.length ? (
        <Text style={styles.dica}>
          Mostrando {atleta.lances.length} de {atleta.totalLances} lances. Os outros aparecem no
          feed.
        </Text>
      ) : null}

      <View style={styles.denunciar}>
        <LinkTexto
          onPress={() =>
            router.push({
              pathname: "/denunciar",
              params: { alvoTipo: "PERFIL", alvoId: atleta.id, nome: atleta.nome },
            })
          }
        >
          Denunciar perfil
        </LinkTexto>
      </View>
    </TelaRolavel>
  );
}

const styles = StyleSheet.create({
  dica: {
    color: cores.textoSecundario,
    fontSize: fonte.apoio,
    lineHeight: 20,
  },
  denunciar: {
    alignItems: "center",
  },
});
