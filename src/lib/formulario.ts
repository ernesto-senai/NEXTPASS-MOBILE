import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { ApiError, mensagemDeErro } from "@/services/api/client";

// Leva os erros da API para os campos do formulário (ex.: e-mail já cadastrado).
// Devolve a mensagem geral quando o erro não pertence a nenhum campo.
export function aplicarErrosDaApi<T extends FieldValues>(
  erro: unknown,
  setError: UseFormSetError<T>,
  campos: readonly Path<T>[],
): string | null {
  if (!(erro instanceof ApiError)) return mensagemDeErro(erro);

  if (erro.codigo === "EMAIL_JA_CADASTRADO" && campos.includes("email" as Path<T>)) {
    setError("email" as Path<T>, { message: erro.message }, { shouldFocus: true });
    return null;
  }

  const comErro = campos.filter((campo) => erro.campos[campo]?.[0]);
  comErro.forEach((campo) => setError(campo, { message: erro.campos[campo]?.[0] }));
  return comErro.length > 0 ? null : erro.message;
}
