import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Botao } from "@/components/ui/botao";
import { CampoTexto } from "@/components/ui/campo-texto";
import { Chips } from "@/components/ui/chips";
import { GrupoCampo } from "@/components/ui/grupo-campo";
import { MensagemErro, MensagemSucesso } from "@/components/ui/mensagem-erro";
import { TelaRolavel } from "@/components/ui/tela-rolavel";
import { TAMANHO_MOTIVO } from "@/features/denuncias/api";
import { useDenunciar } from "@/features/denuncias/hooks";
import { useLayoutResponsivo } from "@/hooks/use-layout-responsivo";
import { mensagemDeErro } from "@/services/api/client";
import { cores, espacamento, fonte } from "@/theme";
import type { AlvoDenuncia } from "@/types/api";

const MOTIVOS = [
  { valor: "Conteúdo impróprio", rotulo: "Conteúdo impróprio" },
  { valor: "Perfil falso", rotulo: "Perfil falso" },
  { valor: "Assédio ou mensagem abusiva", rotulo: "Assédio ou abuso" },
  { valor: "Golpe ou cobrança indevida", rotulo: "Golpe ou cobrança" },
  { valor: "Risco a criança ou adolescente", rotulo: "Risco a menor de idade" },
  { valor: "Outro", rotulo: "Outro" },
] as const;

type Motivo = (typeof MOTIVOS)[number]["valor"];

const ALVOS: Record<AlvoDenuncia, string> = {
  PERFIL: "este perfil",
  VIDEO: "este lance",
  CONVITE: "este convite",
  AVALIACAO: "esta avaliação",
};

// Denúncia de perfil, lance, convite ou avaliação (RF-54)
export default function Denunciar() {
  const router = useRouter();
  const { compacto } = useLayoutResponsivo();
  const params = useLocalSearchParams<{ alvoTipo: AlvoDenuncia; alvoId: string; nome?: string }>();
  const denunciar = useDenunciar();
  const [motivo, setMotivo] = useState<Motivo | null>(null);
  const [detalhes, setDetalhes] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const alvo = ALVOS[params.alvoTipo] ?? "este conteúdo";

  function enviar() {
    if (!motivo) return setErro("Escolha o motivo da denúncia.");
    const texto = detalhes.trim();
    const completo = motivo === "Outro" ? texto : texto ? `${motivo}. ${texto}` : motivo;
    if (completo.length < TAMANHO_MOTIVO.minimo) {
      return setErro("Conte em poucas palavras o que aconteceu (mínimo de 10 caracteres).");
    }
    setErro(null);
    denunciar.mutate({ alvoTipo: params.alvoTipo, alvoId: params.alvoId, motivo: completo });
  }

  if (denunciar.isSuccess) {
    return (
      <TelaRolavel>
        <MensagemSucesso mensagem="Denúncia enviada. A equipe do NextPass vai analisar e tomar as medidas necessárias." />
        <Text style={styles.dica}>Quem foi denunciado não fica sabendo quem fez a denúncia.</Text>
        <Botao titulo="Fechar" variante="contorno" onPress={() => router.back()} />
      </TelaRolavel>
    );
  }

  return (
    <TelaRolavel>
      <View style={styles.cabecalho}>
        <Text
          style={[styles.titulo, { fontSize: compacto ? fonte.tituloCompacto : fonte.titulo }]}
          accessibilityRole="header"
        >
          Denunciar
        </Text>
        <Text style={styles.dica}>
          O que há de errado com {params.nome ? `“${params.nome}”` : alvo}? A denúncia é anônima
          para quem foi denunciado.
        </Text>
      </View>

      <GrupoCampo rotulo="Motivo">
        <Chips
          rotuloAcessivel="Motivo da denúncia"
          opcoes={MOTIVOS}
          selecionados={motivo ? [motivo] : []}
          onAlternar={(valor) => setMotivo(valor === motivo ? null : valor)}
        />
      </GrupoCampo>

      <CampoTexto
        rotulo={motivo === "Outro" ? "Conte o que aconteceu" : "Detalhes (opcional)"}
        placeholder="Ex.: o perfil usa fotos de outra pessoa"
        value={detalhes}
        onChangeText={setDetalhes}
        multiline
        // Sobra espaço para o motivo escolhido, que vai na frente do texto.
        maxLength={TAMANHO_MOTIVO.maximo - 40}
      />

      {erro || denunciar.error ? (
        <MensagemErro mensagem={erro ?? mensagemDeErro(denunciar.error)} />
      ) : null}

      <Botao
        titulo="Enviar denúncia"
        iconeInicio="flag-outline"
        carregando={denunciar.isPending}
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
