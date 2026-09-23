import { Botao } from "@/components/ui/botao";
import { useSair } from "../hooks";

// RF-55: "Sair da conta", nas telas de perfil de cada tipo de usuário.
export function BotaoSair() {
  const sair = useSair();

  return (
    <Botao
      titulo="Sair da conta"
      variante="contorno"
      iconeInicio="log-out-outline"
      carregando={sair.isPending}
      onPress={() => sair.mutate()}
    />
  );
}
