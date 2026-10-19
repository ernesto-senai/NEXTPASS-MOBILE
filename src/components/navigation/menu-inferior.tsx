import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import type { ComponentProps } from "react";
import { cores } from "@/theme";

type NomeIcone = ComponentProps<typeof Ionicons>["name"];

const abas: { nome: string; titulo: string; icone: NomeIcone }[] = [
  { nome: "index", titulo: "Feed", icone: "play-circle" },
  { nome: "pesquisa", titulo: "Pesquisa", icone: "search" },
  { nome: "publicar", titulo: "Publicar", icone: "add-circle-outline" },
  { nome: "notificacoes", titulo: "Notificações", icone: "notifications-outline" },
  { nome: "perfil", titulo: "Perfil", icone: "person" },
];

// RF-51: atletas e olheiros têm o mesmo menu inferior; cada perfil define as
// próprias telas com estes nomes de arquivo dentro de (tabs)/.
export function MenuInferior() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: cores.primaria,
        tabBarInactiveTintColor: cores.textoSecundario,
        tabBarStyle: { backgroundColor: cores.fundo, borderTopColor: cores.borda },
      }}
    >
      {abas.map(({ nome, titulo, icone }) => (
        <Tabs.Screen
          key={nome}
          name={nome}
          options={{
            title: titulo,
            tabBarIcon: ({ color, size }) => <Ionicons name={icone} color={color} size={size} />,
          }}
        />
      ))}
    </Tabs>
  );
}
