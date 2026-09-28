import { Redirect } from "expo-router";
import { useSessao } from "@/store/sessao";

const inicioPorPerfil = {
  ATLETA: "/atleta",
  OLHEIRO: "/olheiro",
  RESPONSAVEL: "/responsavel",
} as const;

// Porta de entrada: manda cada usuário para a área do seu perfil.
export default function Index() {
  const sessao = useSessao((s) => s.sessao);

  if (!sessao) return <Redirect href="/login" />;

  return <Redirect href={inicioPorPerfil[sessao.usuario.tipo]} />;
}
