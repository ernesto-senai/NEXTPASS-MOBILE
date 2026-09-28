import { Image, StyleSheet, Text, View } from "react-native";
import { iniciais } from "@/lib/formatadores";
import { cores } from "@/theme";

interface AvatarProps {
  nome: string;
  fotoUrl?: string | null;
  tamanho?: number;
}

// Foto do usuário ou, sem foto, as iniciais do nome num círculo verde.
export function Avatar({ nome, fotoUrl, tamanho = 44 }: AvatarProps) {
  const forma = { width: tamanho, height: tamanho, borderRadius: tamanho / 2 };

  if (fotoUrl) {
    return (
      <Image source={{ uri: fotoUrl }} style={[styles.base, forma]} accessibilityLabel={nome} />
    );
  }

  return (
    <View style={[styles.base, styles.semFoto, forma]} accessibilityLabel={nome}>
      <Text style={[styles.iniciais, { fontSize: tamanho * 0.36 }]}>{iniciais(nome)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 2,
    borderColor: cores.primaria,
  },
  semFoto: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: cores.primariaEscura,
  },
  iniciais: {
    color: cores.texto,
    fontWeight: "800",
  },
});
