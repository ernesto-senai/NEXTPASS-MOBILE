import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";

// Foto ou documento escolhido no aparelho, pronto para ir no FormData.
export interface ArquivoEscolhido {
  uri: string;
  nome: string;
  tipo: string;
  tamanhoBytes?: number | undefined;
  // Na web, o próprio arquivo vai no FormData.
  arquivoWeb?: File | undefined;
}

// RF-14: foto de perfil quadrada, recortada na hora da escolha. A qualidade
// abaixo de 1 faz o iOS entregar JPG em vez de HEIC.
export async function escolherFoto(): Promise<ArquivoEscolhido | null> {
  const resultado = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });
  const foto = resultado.canceled ? undefined : resultado.assets[0];
  if (!foto) return null;

  return {
    uri: foto.uri,
    nome: foto.fileName ?? "foto.jpg",
    tipo: foto.mimeType ?? "image/jpeg",
    tamanhoBytes: foto.fileSize,
    arquivoWeb: foto.file,
  };
}

// RF-16: documento do olheiro em foto (JPG, PNG) ou PDF.
export async function escolherDocumento(): Promise<ArquivoEscolhido | null> {
  const resultado = await DocumentPicker.getDocumentAsync({
    type: ["image/jpeg", "image/png", "application/pdf"],
    copyToCacheDirectory: true,
  });
  const documento = resultado.canceled ? undefined : resultado.assets[0];
  if (!documento) return null;

  return {
    uri: documento.uri,
    nome: documento.name,
    tipo: documento.mimeType ?? "application/octet-stream",
    tamanhoBytes: documento.size,
    arquivoWeb: documento.file,
  };
}

// Parte do FormData com o arquivo: na web, o arquivo; no celular, o React
// Native lê o arquivo pela uri.
export const arquivoParaEnvio = ({ uri, nome, tipo, arquivoWeb }: ArquivoEscolhido) =>
  arquivoWeb ?? ({ uri, name: nome, type: tipo } as unknown as Blob);
