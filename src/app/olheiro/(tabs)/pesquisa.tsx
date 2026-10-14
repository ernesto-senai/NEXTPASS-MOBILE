import { useRouter } from "expo-router";
import { useState } from "react";
import { BarraBusca, resumoDaBusca } from "@/components/ui/barra-busca";
import { ListaPaginada } from "@/components/ui/lista-paginada";
import { TelaLista } from "@/components/ui/tela-lista";
import { TituloTela } from "@/components/ui/titulo-tela";
import type { FiltrosAtleta } from "@/features/atletas/api";
import { CardAtleta } from "@/features/atletas/components/card-atleta";
import { PainelFiltrosAtletas } from "@/features/atletas/components/painel-filtros-atletas";
import { useAtletas } from "@/features/atletas/hooks";
import { VerificacaoPendente } from "@/features/verificacao/components/verificacao-pendente";
import { useDebounce } from "@/hooks/use-debounce";
import { contarFiltros } from "@/lib/filtros";
import { ehOlheiroNaoVerificado } from "@/services/api/client";

// Busca de atletas por nome e filtros (RF-35 a RF-37)
export default function EncontrarAtleta() {
  const router = useRouter();
  const [texto, setTexto] = useState("");
  const [filtros, setFiltros] = useState<FiltrosAtleta>({});
  const [filtrando, setFiltrando] = useState(false);
  const busca = useDebounce(texto.trim());
  const resultado = useAtletas({ ...filtros, busca });

  if (ehOlheiroNaoVerificado(resultado.error)) return <VerificacaoPendente />;

  return (
    <TelaLista>
      <TituloTela>Encontrar atleta</TituloTela>

      <BarraBusca
        rotulo="Pesquisar atletas"
        placeholder="Pesquisar atletas pelo nome"
        texto={texto}
        onAlterarTexto={setTexto}
        resumo={resumoDaBusca(
          resultado.data?.pages[0]?.total,
          "atleta encontrado",
          "atletas encontrados",
        )}
        filtrosAtivos={contarFiltros(filtros)}
        onFiltrar={() => setFiltrando(true)}
      />

      <ListaPaginada
        consulta={resultado}
        chave={(atleta) => atleta.id}
        renderItem={(atleta) => (
          <CardAtleta
            atleta={atleta}
            onVerLances={() =>
              router.push({ pathname: "/olheiro/atletas/[id]", params: { id: atleta.id } })
            }
          />
        )}
        vazio={{
          icone: "people-outline",
          titulo: "Nenhum atleta encontrado",
          descricao:
            "Só aparecem atletas com o perfil completo. Tente outro nome ou ajuste os filtros.",
        }}
      />

      {filtrando ? (
        <PainelFiltrosAtletas
          filtros={filtros}
          onFechar={() => setFiltrando(false)}
          onAplicar={(novos) => {
            setFiltros(novos);
            setFiltrando(false);
          }}
        />
      ) : null}
    </TelaLista>
  );
}
