import { Alert, Platform } from "react-native";

interface Confirmacao {
  titulo: string;
  mensagem: string;
  // Texto do botão que confirma (ex.: "Excluir").
  acao: string;
}

// Pergunta antes de uma ação que não dá para desfazer (ex.: excluir um lance).
// Na web o Alert do React Native não mostra botões; lá vale o confirm do navegador.
export function confirmar({ titulo, mensagem, acao }: Confirmacao): Promise<boolean> {
  if (Platform.OS === "web") return Promise.resolve(window.confirm(`${titulo}\n\n${mensagem}`));

  return new Promise((resolve) => {
    Alert.alert(
      titulo,
      mensagem,
      [
        { text: "Cancelar", style: "cancel", onPress: () => resolve(false) },
        { text: acao, style: "destructive", onPress: () => resolve(true) },
      ],
      { cancelable: true, onDismiss: () => resolve(false) },
    );
  });
}
