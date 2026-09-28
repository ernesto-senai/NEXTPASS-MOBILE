import { useWindowDimensions } from "react-native";
import { breakpoints, espacamento } from "@/theme";

// Decisões de layout pela largura e altura da tela (mobile-first: o padrão é
// uma coluna; telas largas ganham cartão e campos lado a lado).
export function useLayoutResponsivo() {
  const { width, height } = useWindowDimensions();
  const compacto = width < breakpoints.compacto;
  const largo = width >= breakpoints.largo;

  return {
    compacto,
    largo,
    // Telas baixas ou estreitas: marca menor para o formulário subir.
    reduzirMarca: compacto || height < 700,
    margemLateral: compacto ? espacamento.md : espacamento.lg,
    espacoEntreCampos: compacto ? 12 : espacamento.md,
  };
}
