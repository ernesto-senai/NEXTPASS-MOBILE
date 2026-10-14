import { useState } from "react";
import { CaixaSelecao } from "@/components/ui/caixa-selecao";
import { CampoTexto } from "@/components/ui/campo-texto";
import { Chips } from "@/components/ui/chips";
import { GrupoCampo } from "@/components/ui/grupo-campo";
import { ModalFiltros } from "@/components/ui/modal-filtros";
import { alternarNaLista, alternarUnico } from "@/lib/filtros";
import { CATEGORIAS, POSICOES, TIPOS_AVALIACAO } from "@/lib/rotulos";
import type { FiltrosAvaliacao } from "../api";

const PERIODOS = [
  { valor: "7", rotulo: "Próximos 7 dias" },
  { valor: "30", rotulo: "Próximos 30 dias" },
] as const;

const ORDENS = [
  { valor: "proximas", rotulo: "Data mais próxima" },
  { valor: "recentes", rotulo: "Mais recentes" },
  { valor: "menorPreco", rotulo: "Menor preço" },
] as const;

interface PainelFiltrosProps {
  filtros: FiltrosAvaliacao;
  onAplicar: (filtros: FiltrosAvaliacao) => void;
  onFechar: () => void;
}

// RF-24: filtros da Pesquisa do atleta. As mudanças só valem ao tocar em "Aplicar".
export function PainelFiltros({ filtros, onAplicar, onFechar }: PainelFiltrosProps) {
  const [rascunho, setRascunho] = useState(filtros);
  const [preco, setPreco] = useState(filtros.precoMax?.toString() ?? "");
  const atualizar = (mudanca: FiltrosAvaliacao) =>
    setRascunho((atual) => ({ ...atual, ...mudanca }));

  const aplicar = () => {
    const precoMax = Number(preco.replace(",", "."));
    onAplicar({ ...rascunho, precoMax: preco.trim() && precoMax >= 0 ? precoMax : undefined });
  };

  return (
    <ModalFiltros
      onAplicar={aplicar}
      onFechar={onFechar}
      onLimpar={() => {
        setRascunho({});
        setPreco("");
      }}
    >
      <GrupoCampo rotulo="Categoria">
        <Chips
          rotuloAcessivel="Categoria"
          opcoes={CATEGORIAS}
          selecionados={rascunho.categoria ? [rascunho.categoria] : []}
          onAlternar={(valor) => atualizar({ categoria: alternarUnico(rascunho.categoria, valor) })}
        />
      </GrupoCampo>

      <GrupoCampo rotulo="Tipo de avaliação">
        <Chips
          rotuloAcessivel="Tipo de avaliação"
          opcoes={TIPOS_AVALIACAO}
          selecionados={rascunho.tipo ? [rascunho.tipo] : []}
          onAlternar={(valor) => atualizar({ tipo: alternarUnico(rascunho.tipo, valor) })}
        />
      </GrupoCampo>

      <GrupoCampo rotulo="Data">
        <Chips
          rotuloAcessivel="Data"
          opcoes={PERIODOS}
          selecionados={rascunho.dias ? [String(rascunho.dias)] : []}
          onAlternar={(valor) => atualizar({ dias: alternarUnico(rascunho.dias, Number(valor)) })}
        />
      </GrupoCampo>

      <CampoTexto
        rotulo="Localização"
        icone="location-outline"
        placeholder="Cidade"
        value={rascunho.cidade ?? ""}
        onChangeText={(cidade) => atualizar({ cidade })}
        autoCapitalize="words"
      />

      <CampoTexto
        rotulo="Preço máximo da inscrição"
        icone="cash-outline"
        prefixo="R$"
        placeholder="Ex.: 50"
        value={preco}
        onChangeText={setPreco}
        keyboardType="decimal-pad"
      />

      <GrupoCampo rotulo="Posições procuradas">
        <Chips
          rotuloAcessivel="Posições procuradas"
          opcoes={POSICOES}
          selecionados={rascunho.posicoes ?? []}
          onAlternar={(valor) => atualizar({ posicoes: alternarNaLista(rascunho.posicoes, valor) })}
        />
      </GrupoCampo>

      <GrupoCampo rotulo="Ordenar por">
        <Chips
          rotuloAcessivel="Ordenar por"
          opcoes={ORDENS}
          selecionados={[rascunho.ordenar ?? "proximas"]}
          onAlternar={(ordenar) => atualizar({ ordenar })}
        />
      </GrupoCampo>

      <CaixaSelecao
        rotulo="Mostrar apenas com vagas disponíveis"
        marcada={!!rascunho.comVagas}
        onAlternar={() => atualizar({ comVagas: !rascunho.comVagas })}
      />
    </ModalFiltros>
  );
}
