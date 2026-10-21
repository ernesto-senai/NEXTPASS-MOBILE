import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { z } from "zod";
import { Botao } from "@/components/ui/botao";
import { CampoFormulario } from "@/components/ui/campo-formulario";
import { Etiqueta } from "@/components/ui/etiqueta";
import { LinkTexto } from "@/components/ui/link-texto";
import { MensagemErro, MensagemSucesso } from "@/components/ui/mensagem-erro";
import { TelaRolavel } from "@/components/ui/tela-rolavel";
import { TituloSecao } from "@/components/ui/titulo-secao";
import type { VinculoDoAtleta } from "@/features/vinculos/api";
import { usePedirVinculo, useVinculosDoAtleta } from "@/features/vinculos/hooks";
import { useLayoutResponsivo } from "@/hooks/use-layout-responsivo";
import { aplicarErrosDaApi } from "@/lib/formulario";
import { mensagemDeErro } from "@/services/api/client";
import { cores, espacamento, fonte, raio } from "@/theme";

const pedidoSchema = z.object({
  emailResponsavel: z
    .string()
    .trim()
    .min(1, "Informe o e-mail do responsável.")
    .pipe(z.email("Informe um e-mail válido.")),
});

type DadosPedido = z.infer<typeof pedidoSchema>;

// Menor de 18 anos informa o e-mail do responsável (RF-15, RN-03)
export default function IndicarResponsavel() {
  const { compacto } = useLayoutResponsivo();
  const vinculos = useVinculosDoAtleta();
  const pedir = usePedirVinculo();
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const confirmado = vinculos.data?.find((vinculo) => vinculo.status === "CONFIRMADO");
  // Reenviar usa o e-mail de um indicado; o formulário, um e-mail novo.
  const reenviandoPara = vinculos.data?.some(
    (vinculo) => pedir.isPending && vinculo.emailResponsavel === pedir.variables,
  )
    ? pedir.variables
    : null;

  const { control, handleSubmit, setError, reset } = useForm<DadosPedido>({
    resolver: zodResolver(pedidoSchema),
    defaultValues: { emailResponsavel: "" },
    mode: "onTouched",
  });

  const enviar = handleSubmit((dados) => {
    setErroGeral(null);
    pedir.mutate(dados.emailResponsavel, {
      onSuccess: () => reset(),
      onError: (erro) => setErroGeral(aplicarErrosDaApi(erro, setError, ["emailResponsavel"])),
    });
  });

  function reenviar(email: string) {
    setErroGeral(null);
    pedir.mutate(email, { onError: (erro) => setErroGeral(mensagemDeErro(erro)) });
  }

  return (
    <TelaRolavel>
      <View style={styles.cabecalho}>
        <Text
          style={[styles.titulo, { fontSize: compacto ? fonte.tituloCompacto : fonte.titulo }]}
          accessibilityRole="header"
        >
          Responsável
        </Text>
        <Text style={styles.dica}>
          Como você tem menos de 18 anos, seu pai, mãe ou responsável legal aprova suas inscrições
          nas avaliações e recebe uma cópia dos convites dos olheiros.
        </Text>
      </View>

      {vinculos.isPending ? <ActivityIndicator color={cores.primaria} /> : null}
      {vinculos.isError ? <MensagemErro mensagem={mensagemDeErro(vinculos.error)} /> : null}

      {vinculos.data && vinculos.data.length > 0 ? (
        <>
          <TituloSecao>Indicados</TituloSecao>
          <View style={styles.lista}>
            {vinculos.data.map((vinculo) => (
              <ItemVinculo
                key={vinculo.id}
                vinculo={vinculo}
                reenviando={reenviandoPara === vinculo.emailResponsavel}
                onReenviar={() => reenviar(vinculo.emailResponsavel)}
              />
            ))}
          </View>
        </>
      ) : null}

      {pedir.isSuccess ? (
        <MensagemSucesso
          mensagem={`Enviamos o link para ${pedir.data.emailResponsavel}. Ele vale por 7 dias.`}
        />
      ) : null}
      {erroGeral ? <MensagemErro mensagem={erroGeral} /> : null}

      {confirmado ? null : (
        <>
          <TituloSecao>
            {vinculos.data?.length ? "Indicar outro responsável" : "Indicar responsável"}
          </TituloSecao>
          <CampoFormulario
            control={control}
            nome="emailResponsavel"
            rotulo="E-mail do responsável"
            icone="mail-outline"
            placeholder="email@exemplo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            returnKeyType="send"
            onSubmitEditing={enviar}
          />
          <Text style={styles.dica}>
            Ele recebe um e-mail com o link para criar a conta no NextPass e confirmar o vínculo.
          </Text>
          <Botao
            titulo="Enviar link ao responsável"
            iconeInicio="paper-plane-outline"
            carregando={pedir.isPending && !reenviandoPara}
            onPress={enviar}
          />
        </>
      )}
    </TelaRolavel>
  );
}

interface ItemVinculoProps {
  vinculo: VinculoDoAtleta;
  reenviando: boolean;
  onReenviar: () => void;
}

function ItemVinculo({ vinculo, reenviando, onReenviar }: ItemVinculoProps) {
  const confirmado = vinculo.status === "CONFIRMADO";

  return (
    <View style={styles.item}>
      <View style={styles.textos}>
        <Text style={styles.nome} numberOfLines={1}>
          {vinculo.responsavel?.nome ?? vinculo.emailResponsavel}
        </Text>
        {vinculo.responsavel ? (
          <Text style={styles.dica} numberOfLines={1}>
            {vinculo.emailResponsavel}
          </Text>
        ) : null}
        {confirmado ? (
          <Etiqueta texto="Vínculo confirmado" tom="destaque" icone="checkmark-circle-outline" />
        ) : (
          <Etiqueta texto="Aguardando confirmação" tom="alerta" icone="time-outline" />
        )}
      </View>
      {confirmado ? null : reenviando ? (
        <ActivityIndicator color={cores.primaria} />
      ) : (
        <LinkTexto onPress={onReenviar}>Reenviar</LinkTexto>
      )}
    </View>
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
  lista: {
    gap: espacamento.sm,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacamento.sm,
    padding: 12,
    borderRadius: raio.lg,
    backgroundColor: cores.superficie,
  },
  textos: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  nome: {
    color: cores.texto,
    fontSize: fonte.corpo,
    fontWeight: "700",
  },
});
