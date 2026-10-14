import { useState } from "react";
import { CampoTexto } from "@/components/ui/campo-texto";
import { Chips } from "@/components/ui/chips";
import { type Faixa, FaixaNumerica, numeroOuNada } from "@/components/ui/faixa-numerica";
import { GrupoCampo } from "@/components/ui/grupo-campo";
import { ModalFiltros } from "@/components/ui/modal-filtros";
import { alternarNaLista, alternarUnico } from "@/lib/filtros";
import { CATEGORIAS, PES_PREFERENCIAIS, POSICOES } from "@/lib/rotulos";
import type { FiltrosAtleta } from "../api";

const ORDENS = [
  { valor: "nome", rotulo: "Nome (A–Z)" },
  { valor: "maisNovos", rotulo: "Mais novos" },
  { valor: "maisAltos", rotulo: "Mais altos" },
] as const;

const faixa = (min?: number, max?: number): Faixa => ({
  min: min?.toString() ?? "",
  max: max?.toString() ?? "",
});

interface PainelFiltrosAtletasProps {
  filtros: FiltrosAtleta;
  onAplicar: (filtros: FiltrosAtleta) => void;
  onFechar: () => void;
}

// RF-36: filtros de "Encontrar atleta", na ordem do protótipo. As mudanças só
// valem ao tocar em "Aplicar".
export function PainelFiltrosAtletas({ filtros, onAplicar, onFechar }: PainelFiltrosAtletasProps) {
  const [rascunho, setRascunho] = useState(filtros);
  const [idade, setIdade] = useState(faixa(filtros.idadeMin, filtros.idadeMax));
  const [peso, setPeso] = useState(faixa(filtros.pesoMin, filtros.pesoMax));
  const [altura, setAltura] = useState(faixa(filtros.alturaMin, filtros.alturaMax));
  const atualizar = (mudanca: FiltrosAtleta) => setRascunho((atual) => ({ ...atual, ...mudanca }));

  const aplicar = () =>
    onAplicar({
      ...rascunho,
      idadeMin: numeroOuNada(idade.min),
      idadeMax: numeroOuNada(idade.max),
      pesoMin: numeroOuNada(peso.min),
      pesoMax: numeroOuNada(peso.max),
      alturaMin: numeroOuNada(altura.min),
      alturaMax: numeroOuNada(altura.max),
    });

  const limpar = () => {
    setRascunho({});
    setIdade(faixa());
    setPeso(faixa());
    setAltura(faixa());
  };

  return (
    <ModalFiltros onAplicar={aplicar} onFechar={onFechar} onLimpar={limpar}>
      <GrupoCampo rotulo="Categoria">
        <Chips
          rotuloAcessivel="Categoria"
          opcoes={CATEGORIAS}
          selecionados={rascunho.categoria ? [rascunho.categoria] : []}
          onAlternar={(valor) => atualizar({ categoria: alternarUnico(rascunho.categoria, valor) })}
        />
      </GrupoCampo>

      <CampoTexto
        rotulo="Cidade"
        icone="location-outline"
        placeholder="Ex.: São Paulo"
        value={rascunho.cidade ?? ""}
        onChangeText={(cidade) => atualizar({ cidade })}
        autoCapitalize="words"
      />

      <FaixaNumerica rotulo="Idade" unidade="anos" valor={idade} onAlterar={setIdade} />

      <CampoTexto
        rotulo="Nacionalidade"
        icone="flag-outline"
        placeholder="Ex.: Brasileira"
        value={rascunho.nacionalidade ?? ""}
        onChangeText={(nacionalidade) => atualizar({ nacionalidade })}
        autoCapitalize="words"
      />

      <GrupoCampo rotulo="Pé preferencial">
        <Chips
          rotuloAcessivel="Pé preferencial"
          opcoes={PES_PREFERENCIAIS}
          selecionados={rascunho.pe ? [rascunho.pe] : []}
          onAlternar={(valor) => atualizar({ pe: alternarUnico(rascunho.pe, valor) })}
        />
      </GrupoCampo>

      <FaixaNumerica rotulo="Peso" unidade="kg" valor={peso} onAlterar={setPeso} />
      <FaixaNumerica rotulo="Altura" unidade="cm" valor={altura} onAlterar={setAltura} />

      <GrupoCampo rotulo="Posições">
        <Chips
          rotuloAcessivel="Posições"
          opcoes={POSICOES}
          selecionados={rascunho.posicoes ?? []}
          onAlternar={(valor) => atualizar({ posicoes: alternarNaLista(rascunho.posicoes, valor) })}
        />
      </GrupoCampo>

      <GrupoCampo rotulo="Ordenar por">
        <Chips
          rotuloAcessivel="Ordenar por"
          opcoes={ORDENS}
          selecionados={[rascunho.ordenar ?? "nome"]}
          onAlternar={(ordenar) => atualizar({ ordenar })}
        />
      </GrupoCampo>
    </ModalFiltros>
  );
}
