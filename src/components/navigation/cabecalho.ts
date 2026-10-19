import type { NativeStackNavigationOptions } from "expo-router/native-stack";
import { cores } from "@/theme";

// Cabeçalho escuro só com o botão de voltar; o título fica no corpo da tela.
export const cabecalhoPadrao: NativeStackNavigationOptions = {
  headerTitle: "",
  headerStyle: { backgroundColor: cores.fundo },
  headerTintColor: cores.texto,
  headerShadowVisible: false,
  contentStyle: { backgroundColor: cores.fundo },
};
