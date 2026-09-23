import { Stack } from "expo-router";
import { cabecalhoPadrao } from "@/components/navigation/cabecalho";

export default function ResponsavelLayout() {
  return <Stack screenOptions={cabecalhoPadrao} />;
}
