import { ListaPaginada } from "@/components/ui/lista-paginada";
import { TelaLista } from "@/components/ui/tela-lista";
import { TituloTela } from "@/components/ui/titulo-tela";
import { CardConvite } from "@/features/convites/components/card-convite";
import { useConvitesRecebidos } from "@/features/convites/hooks";

// Convites recebidos com aceitar/recusar (RF-26, RF-27)
export default function CaixaDeConvites() {
  const convites = useConvitesRecebidos();

  return (
    <TelaLista>
      <TituloTela>Caixa de convites</TituloTela>
      <ListaPaginada
        consulta={convites}
        chave={(convite) => convite.id}
        renderItem={(convite) => <CardConvite convite={convite} />}
        vazio={{
          icone: "mail-open-outline",
          titulo: "Nenhum convite por enquanto",
          descricao: "Quando um olheiro chamar você para uma avaliação, o convite aparece aqui.",
        }}
      />
    </TelaLista>
  );
}
