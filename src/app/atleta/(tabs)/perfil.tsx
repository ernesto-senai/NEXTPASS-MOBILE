import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { Aviso } from "@/components/ui/aviso";
import { Botao } from "@/components/ui/botao";
import { EstadoVazio } from "@/components/ui/estado-vazio";
import { LinkTexto } from "@/components/ui/link-texto";
import { MensagemErro } from "@/components/ui/mensagem-erro";
import { TelaLista } from "@/components/ui/tela-lista";
import { TituloSecao } from "@/components/ui/titulo-secao";
import { BotaoSair } from "@/features/auth/components/botao-sair";
import { CarrosselLances } from "@/features/lances/components/carrossel-lances";
import { ItemMeuLance } from "@/features/lances/components/item-meu-lance";
import { useEditarLance, useExcluirLance, useMeusLances } from "@/features/lances/hooks";
import { CabecalhoAtleta } from "@/features/perfil/components/cabecalho-atleta";
import { usePerfil } from "@/features/perfil/hooks";
import { useLayoutResponsivo } from "@/hooks/use-layout-responsivo";
import { confirmar } from "@/lib/confirmar";
import { mensagemDeErro } from "@/services/api/client";
import { cores, espacamento, fonte, larguraMaximaConteudo } from "@/theme";

// Dados técnicos e lances em destaque no carrossel (RF-28 a RF-31)
export default function PerfilAtleta() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { margemLateral, espacoEntreCampos } = useLayoutResponsivo();
  const perfil = usePerfil();
  const lances = useMeusLances();
  const editar = useEditarLance();
  const excluir = useExcluirLance();

  if (!perfil.data) {
    return (
      <TelaLista>
        {perfil.isError ? (
          <EstadoVazio
            icone="cloud-offline-outline"
            titulo="Não foi possível carregar"
            descricao={mensagemDeErro(perfil.error)}
            acao={{ titulo: "Tentar de novo", onPress: () => perfil.refetch() }}
          />
        ) : (
          <ActivityIndicator style={styles.carregando} color={cores.primaria} size="large" />
        )}
      </TelaLista>
    );
  }

  const { atleta } = perfil.data;
  if (!atleta) return null;
  const menor = atleta.idade !== null && atleta.idade < 18;
  const todos = lances.data?.dados ?? [];
  const destaques = todos.filter((lance) => lance.destaque);
  const erroNosLances = editar.error ?? excluir.error;
  const ocupado = editar.isPending || excluir.isPending;
  const largura = Math.min(width, larguraMaximaConteudo) - 2 * margemLateral;

  async function pedirExclusao(id: string) {
    const confirmou = await confirmar({
      titulo: "Excluir lance?",
      mensagem: "O vídeo sai do seu perfil e do feed dos olheiros. Não dá para desfazer.",
      acao: "Excluir",
    });
    if (confirmou) excluir.mutate(id);
  }

  return (
    <TelaLista>
      <ScrollView
        contentContainerStyle={[
          styles.conteudo,
          { paddingHorizontal: margemLateral, gap: espacoEntreCampos },
        ]}
      >
        <CabecalhoAtleta perfil={perfil.data} atleta={atleta} />

        {/* RF-13 e RN-02: sem os dados técnicos, o atleta não aparece na busca. */}
        {atleta.perfilCompleto ? (
          <View style={styles.editar}>
            <LinkTexto onPress={() => router.push("/atleta/editar-perfil")}>
              Editar perfil
            </LinkTexto>
          </View>
        ) : (
          <Aviso
            icone="alert-circle-outline"
            titulo="Complete seu perfil"
            texto="Com os dados técnicos, você aparece na busca dos olheiros e pode se inscrever nas avaliações."
            acao={{
              titulo: "Completar perfil",
              onPress: () => router.push("/atleta/editar-perfil"),
            }}
          />
        )}

        {/* RF-15 e RN-03: menor de 18 anos precisa de responsável vinculado. */}
        {menor && atleta.responsavel !== "CONFIRMADO" ? (
          <Aviso
            icone="people-outline"
            titulo={atleta.responsavel ? "Aguardando seu responsável" : "Indique seu responsável"}
            texto="Como você tem menos de 18 anos, seu responsável aprova as inscrições e recebe uma cópia dos convites."
            acao={{ titulo: "Ver responsável", onPress: () => router.push("/atleta/responsavel") }}
          />
        ) : null}

        <Botao
          titulo="Postar novo lance"
          iconeInicio="add"
          onPress={() => router.push("/atleta/publicar")}
        />

        <TituloSecao>Lances em destaque</TituloSecao>
        {destaques.length > 0 ? (
          <CarrosselLances lances={destaques} largura={largura} />
        ) : (
          <Text style={styles.dica}>
            Toque na estrela de até 3 lances abaixo para que eles apareçam aqui, em destaque para os
            olheiros.
          </Text>
        )}

        <TituloSecao>Meus lances</TituloSecao>
        {erroNosLances ? <MensagemErro mensagem={mensagemDeErro(erroNosLances)} /> : null}
        {lances.isPending ? <ActivityIndicator color={cores.primaria} /> : null}
        {lances.data && todos.length === 0 ? (
          <Text style={styles.dica}>
            Você ainda não publicou lances. Poste um vídeo de 30 a 60 segundos mostrando seu
            futebol.
          </Text>
        ) : null}
        <View style={styles.lista}>
          {todos.map((lance) => (
            <ItemMeuLance
              key={lance.id}
              lance={lance}
              ocupado={ocupado}
              onAlternarDestaque={() => editar.mutate({ id: lance.id, destaque: !lance.destaque })}
              onExcluir={() => pedirExclusao(lance.id)}
            />
          ))}
        </View>

        <View style={styles.sair}>
          <BotaoSair />
        </View>
      </ScrollView>
    </TelaLista>
  );
}

const styles = StyleSheet.create({
  carregando: {
    flex: 1,
  },
  conteudo: {
    paddingTop: espacamento.md,
    paddingBottom: espacamento.lg,
  },
  editar: {
    alignItems: "center",
    marginTop: -espacamento.sm,
  },
  dica: {
    color: cores.textoSecundario,
    fontSize: fonte.apoio,
    lineHeight: 20,
  },
  lista: {
    gap: espacamento.sm,
  },
  sair: {
    marginTop: espacamento.md,
  },
});
