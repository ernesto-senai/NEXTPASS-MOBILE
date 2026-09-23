import { Stack } from "expo-router";
import { cabecalhoPadrao } from "@/components/navigation/cabecalho";

export default function AuthLayout() {
  return (
    <Stack screenOptions={cabecalhoPadrao}>
      <Stack.Screen name="login" options={{ headerShown: false }} />
    </Stack>
  );
}
