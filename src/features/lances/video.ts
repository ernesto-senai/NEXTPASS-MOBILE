import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";

// RN-09 e RNF-04: os mesmos limites da API, conferidos antes do envio para o
// atleta não esperar o upload terminar para descobrir o problema.
export const LIMITES_LANCE = { duracaoMinSeg: 30, duracaoMaxSeg: 60, tamanhoMaxMb: 50 } as const;
const FORMATOS = ["video/mp4", "video/quicktime"];

export interface VideoEscolhido {
  uri: string;
  nome: string;
  tipo: string;
  tamanhoBytes?: number | undefined;
  duracaoSeg?: number | undefined;
  // Na web, o próprio arquivo vai no FormData.
  arquivoWeb?: File | undefined;
}

// Abre a galeria só com vídeos. RNF-04: no iOS o vídeo sai comprimido em 720p;
// no Android a biblioteca não comprime, e o limite de 50 MB é conferido aqui.
export async function escolherVideo(): Promise<VideoEscolhido | null> {
  const resultado = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["videos"],
    videoExportPreset: ImagePicker.VideoExportPreset.H264_1280x720,
  });
  const video = resultado.canceled ? undefined : resultado.assets[0];
  if (!video) return null;

  return {
    uri: video.uri,
    nome: video.fileName ?? "lance.mp4",
    tipo: video.mimeType ?? "video/mp4",
    tamanhoBytes: video.fileSize,
    // A web informa a duração em segundos; o celular, em milissegundos.
    duracaoSeg: video.duration
      ? Platform.OS === "web"
        ? video.duration
        : video.duration / 1000
      : undefined,
    arquivoWeb: video.file,
  };
}

// Motivo para recusar o vídeo antes do envio, ou null se ele pode ser enviado.
export function problemaDoVideo({ tipo, tamanhoBytes, duracaoSeg }: VideoEscolhido) {
  const { duracaoMinSeg, duracaoMaxSeg, tamanhoMaxMb } = LIMITES_LANCE;
  if (!FORMATOS.includes(tipo)) return "Escolha um vídeo MP4 ou MOV.";
  if (tamanhoBytes && tamanhoBytes > tamanhoMaxMb * 1024 * 1024) {
    return `O vídeo pode ter até ${tamanhoMaxMb} MB.`;
  }
  if (duracaoSeg !== undefined) {
    const segundos = Math.round(duracaoSeg);
    if (segundos < duracaoMinSeg || segundos > duracaoMaxSeg) {
      return `O lance precisa ter de ${duracaoMinSeg} a ${duracaoMaxSeg} segundos. Este tem ${segundos} s.`;
    }
  }
  return null;
}

// Parte do FormData com o vídeo: na web, o arquivo; no celular, o React Native
// lê o arquivo pela uri.
export const videoParaEnvio = ({ uri, nome, tipo, arquivoWeb }: VideoEscolhido) =>
  arquivoWeb ?? ({ uri, name: nome, type: tipo } as unknown as Blob);
