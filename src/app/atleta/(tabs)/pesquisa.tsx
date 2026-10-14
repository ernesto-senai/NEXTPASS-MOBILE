import { useRouter } from "expo-router";
import { useState } from "react";
import { BarraBusca, resumoDaBusca } from "@/components/ui/barra-busca";
import { ListaPaginada } from "@/components/ui/lista-paginada";
import { TelaLista } from "@/components/ui/tela-lista";
import type { FiltrosAvaliacao } from "@/features/avaliacoes/api";
import { CardAvaliacao } from "@/features/avaliacoes/components/card-avaliacao";
import { PainelFiltros } from "@/features/avaliacoes/components/painel-filtros";
import { useAvaliacoes } from "@/features/avaliacoes/hooks";
import { useDebounce } from "@/hooks/use-debounce";
import { contarFiltros } from "@/lib/filtros";

// Busca e filtros de avaliações (RF-23, RF-24)
export default function PesquisaAvaliacoes() {
  const router = useRouter();
  const [texto, setTexto] = useState("");
  const [filtros, setFiltros] = useState<FiltrosAvaliacao>({});
  const [filtrando, setFiltrando] = useState(false);
  const busca = useDebounce(texto.trim());
  const resultado = useAvaliacoes({ ...filtros, busca });

  return (
    <TelaLista>
      <BarraBusca
        rotulo="Pesquisar peneiras"
        placeholder="Pesquisar peneiras ou clubes"
        texto={texto}
        onAlterarTexto={setTexto}
        resumo={resumoDaBusca(
          resultado.data?.pages[0]?.total,
          "avaliação encontrada",
          "avaliações encontradas",
        )}
        filtrosAtivos={contarFiltros(filtros)}
        onFiltrar={() => setFiltrando(true)}
      />

      <ListaPaginada
        consulta={resultado}
        chave={(avaliacao) => avaliacao.id}
        renderItem={(avaliacao) => (
          <CardAvaliacao
            avaliacao={avaliacao}
            onAbrir={() =>
              router.push({ pathname: "/avaliacoes/[id]", params: { id: avaliacao.id } })
            }
          />
        )}
        vazio={{
          icone: "search-outline",
          titulo: "Nenhuma avaliação encontrada",
          descricao: "Tente outro nome ou ajuste os filtros.",
        }}
      />

      {filtrando ? (
        <PainelFiltros
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
