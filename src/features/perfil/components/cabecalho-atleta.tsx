import { CartaoAtleta } from "@/features/atletas/components/cartao-atleta";
import { formatarAltura, formatarCategoria } from "@/lib/formatadores";
import { PES_PREFERENCIAIS, POSICOES, rotuloDe } from "@/lib/rotulos";
import type { Perfil, PerfilAtleta } from "../api";
import { FotoPerfil } from "./foto-perfil";

const SEM_DADO = "—";

// Cartão do topo do próprio perfil (protótipo "Perfil Atleta"), com a foto que
// o atleta pode trocar. Enquanto o perfil está incompleto, os dados aparecem com "—".
export function CabecalhoAtleta({ perfil, atleta }: { perfil: Perfil; atleta: PerfilAtleta }) {
  const posicoes = atleta.posicoes.map((posicao) => rotuloDe(POSICOES, posicao)).join(", ");
  const local = [atleta.cidade, atleta.uf].filter(Boolean).join(", ");
  const detalhes = [atleta.idade === null ? null : `${atleta.idade} anos`, local || null]
    .filter(Boolean)
    .join(" · ");

  return (
    <CartaoAtleta
      nome={perfil.nome}
      fotoUrl={perfil.fotoUrl}
      foto={<FotoPerfil nome={perfil.nome} fotoUrl={perfil.fotoUrl} />}
      detalhes={[posicoes, detalhes]}
      ficha={[
        {
          rotulo: "Categoria",
          valor: atleta.categoria ? formatarCategoria(atleta.categoria) : SEM_DADO,
        },
        {
          rotulo: "Altura",
          valor: atleta.alturaCm ? formatarAltura(atleta.alturaCm) : SEM_DADO,
        },
        {
          rotulo: "Pé",
          valor: atleta.pePreferencial
            ? rotuloDe(PES_PREFERENCIAIS, atleta.pePreferencial)
            : SEM_DADO,
        },
      ]}
    />
  );
}
