import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EstadoVazio } from "@/components/ui/estado-vazio";
import { cores } from "@/theme";

// RN-04: em vez de um erro, o olheiro novo vê o que falta para liberar as
// funções (feed de lances, busca de atletas, criar avaliações e convites).
export function VerificacaoPendente() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.tela}>
      <EstadoVazio
        icone="shield-checkmark-outline"
        titulo="Sua conta está em verificação"
        descricao="Para proteger os atletas, esta área é liberada depois que a equipe do NextPass aprova seus documentos."
        acao={{ titulo: "Enviar documentos", onPress: () => router.push("/olheiro/verificacao") }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: cores.fundo,
  },
});
