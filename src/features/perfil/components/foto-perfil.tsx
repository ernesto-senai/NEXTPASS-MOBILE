import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { Avatar } from "@/components/ui/avatar";
import { useLayoutResponsivo } from "@/hooks/use-layout-responsivo";
import { escolherFoto } from "@/lib/arquivos";
import { mensagemDeErro } from "@/services/api/client";
import { areaToqueMinima, cores, fonte } from "@/theme";
import { useTrocarFoto } from "../hooks";

// RF-14: foto do próprio perfil com o botão de câmera para trocar.
export function FotoPerfil({ nome, fotoUrl }: { nome: string; fotoUrl: string | null }) {
  const { compacto } = useLayoutResponsivo();
  const trocar = useTrocarFoto();

  async function escolher() {
    const foto = await escolherFoto();
    if (foto) trocar.mutate(foto);
  }

  return (
    <View style={styles.bloco}>
      <Pressable
        onPress={escolher}
        disabled={trocar.isPending}
        accessibilityRole="button"
        accessibilityLabel="Trocar foto de perfil"
        style={({ pressed }) => pressed && styles.pressionado}
      >
        <Avatar nome={nome} fotoUrl={fotoUrl} tamanho={compacto ? 72 : 88} />
        <View style={styles.camera}>
          {trocar.isPending ? (
            <ActivityIndicator color={cores.texto} size="small" />
          ) : (
            <Ionicons name="camera" size={16} color={cores.texto} />
          )}
        </View>
      </Pressable>
      {trocar.isError ? (
        <Text style={styles.erro} accessibilityRole="alert">
          {mensagemDeErro(trocar.error)}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bloco: {
    alignItems: "center",
  },
  pressionado: {
    opacity: 0.8,
  },
  // O círculo é pequeno, mas a área de toque é a foto inteira (RNF-14).
  camera: {
    position: "absolute",
    right: -4,
    bottom: -4,
    width: areaToqueMinima - 12,
    height: areaToqueMinima - 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: cores.fundo,
    borderRadius: 999,
    backgroundColor: cores.primaria,
  },
  erro: {
    marginTop: 6,
    color: cores.erro,
    fontSize: fonte.apoio,
    textAlign: "center",
  },
});
