import { ActivityIndicator, StyleSheet, View } from "react-native";
import { mensagemDeErro } from "@/services/api/client";
import { cores } from "@/theme";
import { EstadoVazio } from "./estado-vazio";

interface CarregandoProps {
  erro?: unknown;
  onTentarDeNovo?: () => void;
}

// Tela inteira esperando os dados, ou o erro com "Tentar de novo".
export function Carregando({ erro, onTentarDeNovo }: CarregandoProps) {
  return (
    <View style={styles.tela}>
      {erro ? (
        <EstadoVazio
          icone="cloud-offline-outline"
          titulo="Não foi possível carregar"
          descricao={mensagemDeErro(erro)}
          acao={onTentarDeNovo ? { titulo: "Tentar de novo", onPress: onTentarDeNovo } : undefined}
        />
      ) : (
        <ActivityIndicator color={cores.primaria} size="large" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: cores.fundo,
  },
});
