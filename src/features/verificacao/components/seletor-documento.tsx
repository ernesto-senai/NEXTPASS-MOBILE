import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { ArquivoEscolhido } from "@/lib/arquivos";
import { formatarMegabytes } from "@/lib/formatadores";
import { alturaCampo, cores, espacamento, fonte, raio } from "@/theme";

interface SeletorDocumentoProps {
  rotulo: string;
  arquivo: ArquivoEscolhido | null;
  onEscolher: () => void;
  desativado?: boolean;
}

// Campo de arquivo: sem arquivo, convida a escolher; com arquivo, mostra o
// nome e o tamanho, e tocar troca o arquivo.
export function SeletorDocumento({
  rotulo,
  arquivo,
  onEscolher,
  desativado = false,
}: SeletorDocumentoProps) {
  const ehPdf = arquivo?.tipo === "application/pdf";

  return (
    <View>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <Pressable
        onPress={onEscolher}
        disabled={desativado}
        accessibilityRole="button"
        accessibilityLabel={arquivo ? `${rotulo}: ${arquivo.nome}. Trocar arquivo` : rotulo}
        accessibilityHint="JPG, PNG ou PDF de até 10 MB"
        style={({ pressed }) => [
          styles.caixa,
          !!arquivo && styles.caixaEscolhida,
          pressed && styles.pressionado,
        ]}
      >
        <Ionicons
          name={
            arquivo ? (ehPdf ? "document-text-outline" : "image-outline") : "cloud-upload-outline"
          }
          size={22}
          color={cores.primaria}
        />
        <View style={styles.textos}>
          <Text style={styles.nome} numberOfLines={1}>
            {arquivo ? arquivo.nome : "Escolher arquivo"}
          </Text>
          <Text style={styles.dica}>
            {arquivo
              ? [
                  arquivo.tamanhoBytes ? formatarMegabytes(arquivo.tamanhoBytes) : null,
                  "Tocar para trocar",
                ]
                  .filter(Boolean)
                  .join(" · ")
              : "JPG, PNG ou PDF de até 10 MB"}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  rotulo: {
    color: cores.primaria,
    fontSize: fonte.rotulo,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  caixa: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: alturaCampo + 16,
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: espacamento.sm,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: cores.borda,
    borderRadius: raio.md,
    backgroundColor: cores.fundoCampo,
  },
  caixaEscolhida: {
    borderStyle: "solid",
    borderColor: cores.primaria,
  },
  pressionado: {
    opacity: 0.85,
  },
  textos: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  nome: {
    color: cores.texto,
    fontSize: fonte.corpo,
    fontWeight: "700",
  },
  dica: {
    color: cores.textoSecundario,
    fontSize: fonte.apoio,
  },
});
