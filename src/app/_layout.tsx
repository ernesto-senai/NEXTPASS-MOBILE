import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { cabecalhoPadrao } from "@/components/navigation/cabecalho";
import { queryClient } from "@/lib/query-client";
import { useSessao } from "@/store/sessao";

SplashScreen.preventAutoHideAsync();

// Cada perfil só enxerga as próprias rotas: o Stack.Protected bloqueia a
// navegação para grupos cujo guard é falso (RN-04, privacidade por padrão).
export default function RootLayout() {
  const sessao = useSessao((s) => s.sessao);
  const carregada = useSessao((s) => s.carregada);
  const carregar = useSessao((s) => s.carregar);
  // Fontes dos ícones antes da primeira tela, para não aparecerem vazios.
  const [fontesProntas, erroFontes] = useFonts({
    ...Ionicons.font,
    ...MaterialCommunityIcons.font,
  });
  const pronto = carregada && (fontesProntas || !!erroFontes);

  useEffect(() => {
    carregar();
  }, [carregar]);

  useEffect(() => {
    if (pronto) SplashScreen.hideAsync();
  }, [pronto]);

  if (!pronto) return null;

  const tipo = sessao?.usuario.tipo;

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="light" />
      <Stack screenOptions={{ ...cabecalhoPadrao, headerShown: false }}>
        <Stack.Protected guard={!sessao}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>

        <Stack.Protected guard={tipo === "ATLETA"}>
          <Stack.Screen name="atleta" />
        </Stack.Protected>

        <Stack.Protected guard={tipo === "OLHEIRO"}>
          <Stack.Screen name="olheiro" />
        </Stack.Protected>

        <Stack.Protected guard={tipo === "RESPONSAVEL"}>
          <Stack.Screen name="responsavel" />
        </Stack.Protected>

        <Stack.Protected guard={!!sessao}>
          <Stack.Screen name="avaliacoes/[id]" options={{ headerShown: true }} />
          <Stack.Screen name="denunciar" options={{ headerShown: true, presentation: "modal" }} />
        </Stack.Protected>
      </Stack>
    </QueryClientProvider>
  );
}
