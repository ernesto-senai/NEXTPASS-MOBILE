import { StyleSheet, Text, View } from "react-native";
import { useLayoutResponsivo } from "@/hooks/use-layout-responsivo";
import { cores, espacamento, fonte } from "@/theme";

interface TituloFormularioProps {
  inicio: string;
  destaque: string;
  subtitulo: string;
}

// Título com a última parte em verde, como no protótipo ("Bem-vindo de volta!").
export function TituloFormulario({ inicio, destaque, subtitulo }: TituloFormularioProps) {
  const { compacto } = useLayoutResponsivo();

  return (
    <View style={styles.bloco}>
      <Text
        style={[styles.titulo, { fontSize: compacto ? fonte.tituloCompacto : fonte.titulo }]}
        accessibilityRole="header"
      >
        {inicio}
        <Text style={styles.destaque}>{destaque}</Text>
      </Text>
      <Text style={styles.subtitulo}>{subtitulo}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bloco: {
    alignItems: "center",
    gap: espacamento.xs,
  },
  titulo: {
    color: cores.texto,
    fontWeight: "800",
    textAlign: "center",
  },
  destaque: {
    color: cores.primaria,
  },
  subtitulo: {
    color: cores.textoSecundario,
    fontSize: fonte.apoio + 1,
    textAlign: "center",
  },
});
