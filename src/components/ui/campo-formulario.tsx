import type { ComponentProps } from "react";
import { type Control, Controller, type FieldPathByValue, type FieldValues } from "react-hook-form";
import { CampoTexto } from "./campo-texto";

type PropsDoCampo = Omit<
  ComponentProps<typeof CampoTexto>,
  "value" | "onChangeText" | "onBlur" | "erro" | "ref"
>;

interface CampoFormularioProps<T extends FieldValues> extends PropsDoCampo {
  control: Control<T>;
  nome: FieldPathByValue<T, string>;
  // Formata o que é digitado (ex.: data DD/MM/AAAA, valor em reais).
  mascara?: (texto: string) => string;
}

// CampoTexto ligado ao react-hook-form: valor, erro de validação e foco no
// primeiro campo com erro ao enviar.
export function CampoFormulario<T extends FieldValues>({
  control,
  nome,
  mascara,
  ...props
}: CampoFormularioProps<T>) {
  return (
    <Controller
      control={control}
      name={nome}
      render={({ field, fieldState }) => (
        <CampoTexto
          ref={field.ref}
          value={field.value}
          onChangeText={(texto) => field.onChange(mascara ? mascara(texto) : texto)}
          onBlur={field.onBlur}
          erro={fieldState.error?.message}
          {...props}
        />
      )}
    />
  );
}
