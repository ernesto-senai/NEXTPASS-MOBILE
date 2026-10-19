import * as SecureStore from "expo-secure-store";

// Android/iOS: Keychain/Keystore. A versão web fica em armazenamento-seguro.web.ts.
export const armazenamentoSeguro = {
  obter: (chave: string) => SecureStore.getItemAsync(chave),
  salvar: (chave: string, valor: string) => SecureStore.setItemAsync(chave, valor),
  remover: (chave: string) => SecureStore.deleteItemAsync(chave),
};
