import { Stack } from "expo-router";
import { cabecalhoPadrao } from "@/components/navigation/cabecalho";

export default function OlheiroLayout() {
  return (
    <Stack screenOptions={cabecalhoPadrao}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
