import { StyleSheet, Text } from "react-native";
import { useLayoutResponsivo } from "@/hooks/use-layout-responsivo";
import { cores, espacamento, fonte } from "@/theme";

// Título no topo das abas ("Encontrar atleta", "Adicionar lance"), alinhado
// com a margem lateral do conteúdo e menor nos celulares compactos.
export function TituloTela({ children }: { children: string }) {
  const { compacto, margemLateral } = useLayoutResponsivo();

  return (
    <Text
      style={[
        styles.titulo,
        {
          paddingHorizontal: margemLateral,
          fontSize: compacto ? fonte.tituloCompacto : fonte.titulo,
        },
      ]}
      accessibilityRole="header"
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  titulo: {
    color: cores.texto,
    fontWeight: "800",
    paddingTop: espacamento.md,
  },
});
