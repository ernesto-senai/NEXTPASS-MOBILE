// O expo-secure-store não tem implementação web; no navegador usamos o
// localStorage, que não é criptografado. Serve para desenvolvimento.
export const armazenamentoSeguro = {
  obter: async (chave: string) => localStorage.getItem(chave),
  salvar: async (chave: string, valor: string) => localStorage.setItem(chave, valor),
  remover: async (chave: string) => localStorage.removeItem(chave),
};
