import { Ionicons } from "@expo/vector-icons";
import { type ComponentProps, type Ref, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, type TextInputProps, View } from "react-native";
import { alturaCampo, areaToqueMinima, cores, espacamento, fonte, raio } from "@/theme";

interface CampoTextoProps extends Omit<TextInputProps, "style"> {
  rotulo: string;
  icone: ComponentProps<typeof Ionicons>["name"];
  erro?: string | undefined;
  // Texto fixo antes do valor, como o "+55" do telefone.
  prefixo?: string;
  // Campo de senha com o botão de mostrar/ocultar (RF-02).
  senha?: boolean;
  ref?: Ref<TextInput>;
}

export function CampoTexto({
  rotulo,
  icone,
  erro,
  prefixo,
  senha = false,
  ref,
  onFocus,
  onBlur,
  ...props
}: CampoTextoProps) {
  const [oculto, setOculto] = useState(senha);
  const [focado, setFocado] = useState(false);

  return (
    <View>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <View style={[styles.caixa, focado && styles.caixaFocada, !!erro && styles.caixaComErro]}>
        <Ionicons name={icone} size={20} color={cores.textoSecundario} />
        {prefixo ? <Text style={styles.prefixo}>{prefixo}</Text> : null}
        <TextInput
          ref={ref}
          style={styles.input}
          placeholderTextColor={cores.placeholder}
          secureTextEntry={oculto}
          accessibilityLabel={rotulo}
          accessibilityHint={erro}
          onFocus={(evento) => {
            setFocado(true);
            onFocus?.(evento);
          }}
          onBlur={(evento) => {
            setFocado(false);
            onBlur?.(evento);
          }}
          {...props}
        />
        {senha ? (
          <Pressable
            onPress={() => setOculto((valor) => !valor)}
            style={styles.botaoOlho}
            accessibilityRole="button"
            accessibilityLabel={oculto ? "Mostrar senha" : "Ocultar senha"}
          >
            <Ionicons
              name={oculto ? "eye-outline" : "eye-off-outline"}
              size={22}
              color={cores.textoSecundario}
            />
          </Pressable>
        ) : null}
      </View>
      {erro ? (
        <Text style={styles.erro} accessibilityLiveRegion="polite">
          {erro}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  rotulo: {
    color: cores.primaria,
    fontSize: fonte.rotulo,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  caixa: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: alturaCampo,
    gap: espacamento.sm,
    paddingLeft: 14,
    borderWidth: 1,
    borderColor: cores.bordaCampo,
    borderRadius: raio.md,
    backgroundColor: cores.fundoCampo,
  },
  caixaFocada: {
    borderColor: cores.primaria,
  },
  caixaComErro: {
    borderColor: cores.erro,
  },
  prefixo: {
    color: cores.textoSecundario,
    fontSize: fonte.input,
  },
  input: {
    flex: 1,
    minWidth: 0,
    minHeight: alturaCampo - 2,
    paddingVertical: 12,
    paddingRight: espacamento.md,
    color: cores.texto,
    fontSize: fonte.input,
  },
  botaoOlho: {
    width: areaToqueMinima,
    height: areaToqueMinima,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 2,
  },
  erro: {
    color: cores.erro,
    fontSize: fonte.apoio,
    marginTop: espacamento.xs,
  },
});
