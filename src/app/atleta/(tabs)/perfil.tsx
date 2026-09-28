import { Tela } from "@/components/ui/tela";
import { BotaoSair } from "@/features/auth/components/botao-sair";

// Dados técnicos e lances em destaque no carrossel (RF-28 a RF-31)
export default function PerfilAtleta() {
  return (
    <Tela titulo="Meu perfil">
      <BotaoSair />
    </Tela>
  );
}
