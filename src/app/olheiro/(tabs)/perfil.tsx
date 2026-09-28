import { Tela } from "@/components/ui/tela";
import { BotaoSair } from "@/features/auth/components/botao-sair";

// Perfil do olheiro e avaliações com total de inscritos (RF-42, RF-43)
export default function PerfilOlheiro() {
  return (
    <Tela titulo="Minhas avaliações">
      <BotaoSair />
    </Tela>
  );
}
