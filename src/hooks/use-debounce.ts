import { useEffect, useState } from "react";

// Devolve o valor só depois que ele para de mudar por `atrasoMs` (ex.: a busca
// espera o usuário parar de digitar antes de chamar a API).
export function useDebounce<T>(valor: T, atrasoMs = 400): T {
  const [atrasado, setAtrasado] = useState(valor);

  useEffect(() => {
    const espera = setTimeout(() => setAtrasado(valor), atrasoMs);
    return () => clearTimeout(espera);
  }, [valor, atrasoMs]);

  return atrasado;
}
