import { Image, StyleSheet, Text, View } from "react-native";
import { useLayoutResponsivo } from "@/hooks/use-layout-responsivo";
import { cores } from "@/theme";

const logo = require("../../../../assets/images/logo.png");
const PROPORCAO_LOGO = 286 / 328;

// Logo e nome do app. Em telas baixas ou estreitas a marca encolhe para o
// formulário aparecer sem precisar rolar.
export function MarcaNextPass() {
  const { reduzirMarca } = useLayoutResponsivo();
  const largura = reduzirMarca ? 80 : 120;

  return (
    <View style={styles.marca} accessible accessibilityRole="image" accessibilityLabel="NextPass">
      <Image source={logo} style={{ width: largura, height: largura * PROPORCAO_LOGO }} />
      <Text style={[styles.nome, { fontSize: reduzirMarca ? 26 : 34 }]}>
        NEXT <Text style={styles.destaque}>PASS</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  marca: {
    alignItems: "center",
    gap: 6,
  },
  nome: {
    color: cores.texto,
    fontWeight: "900",
    letterSpacing: 1,
  },
  destaque: {
    color: cores.primaria,
  },
});
