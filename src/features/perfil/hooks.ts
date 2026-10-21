import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type Perfil, perfilApi } from "./api";

// RF-14 e RF-28: dados do usuário logado.
export function usePerfil() {
  return useQuery({ queryKey: ["perfil"], queryFn: perfilApi.buscar });
}

// RF-13 e RF-14: a resposta já é o perfil atualizado, com idade e categoria.
export function useAtualizarPerfilAtleta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: perfilApi.atualizarAtleta,
    onSuccess: (perfil) => queryClient.setQueryData(["perfil"], perfil),
  });
}

// RF-14: troca a foto e já mostra a nova no perfil.
export function useTrocarFoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: perfilApi.trocarFoto,
    onSuccess: ({ fotoUrl }) =>
      queryClient.setQueryData<Perfil>(["perfil"], (perfil) => perfil && { ...perfil, fotoUrl }),
  });
}
