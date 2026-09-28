import { Stack } from "expo-router";
import { cabecalhoPadrao } from "@/components/navigation/cabecalho";

// Login e cadastro sem cabeçalho, para aproveitar a tela inteira no celular;
// as demais telas mostram o botão de voltar.
export default function AuthLayout() {
  return (
    <Stack screenOptions={cabecalhoPadrao}>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="cadastro" options={{ headerShown: false }} />
    </Stack>
  );
}
