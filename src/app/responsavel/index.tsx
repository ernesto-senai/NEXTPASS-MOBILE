import { Tela } from "@/components/ui/tela";
import { BotaoSair } from "@/features/auth/components/botao-sair";

// Convites e inscrições dos atletas vinculados para aprovar (RF-49, RF-50). Ainda sem protótipo
export default function SupervisaoResponsavel() {
  return (
    <Tela titulo="Atletas vinculados">
      <BotaoSair />
    </Tela>
  );
}
