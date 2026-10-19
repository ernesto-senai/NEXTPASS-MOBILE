import { Stack } from "expo-router";
import { cabecalhoPadrao } from "@/components/navigation/cabecalho";

export default function AtletaLayout() {
  return (
    <Stack screenOptions={cabecalhoPadrao}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
