// Identidade visual do NextPass (RNF-13): tema escuro com destaques em verde.
export const cores = {
  fundo: "#000000",
  superficie: "#181819",
  borda: "#244B2B",
  primaria: "#50A041",
  primariaEscura: "#244B2B",
  texto: "#FFFFFF",
  textoSecundario: "#A1A1AA",
  erro: "#E5484D",
  fundoCampo: "#0E0E0F",
  bordaCampo: "#2E2E31",
  placeholder: "#8A8A93",
} as const;

// Gradiente dos botões principais do protótipo: do verde claro ao escuro.
export const gradientePrimario = [cores.primaria, cores.primariaEscura] as const;

export const espacamento = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;

export const raio = { sm: 8, md: 12, lg: 16 } as const;

// Inputs e placeholders nunca ficam abaixo de 16: abaixo disso o Safari do iOS
// dá zoom automático ao focar o campo na versão web.
export const fonte = {
  rotulo: 13,
  apoio: 14,
  corpo: 16,
  input: 16,
  botao: 17,
  titulo: 26,
  tituloCompacto: 22,
} as const;

// < 360: celular compacto (a partir de 320px). A partir de 600 (tablet e
// navegador) o formulário vira um cartão centralizado e pode ter duas colunas.
export const breakpoints = { compacto: 360, largo: 600 } as const;

export const larguraMaximaFormulario = 440;

// Listas e feeds não esticam além disso em tablets e no navegador.
export const larguraMaximaConteudo = 640;

// RNF-14: área de toque mínima de 44 × 44 pt. Campos e botões usam 48 e 52.
export const areaToqueMinima = 44;
export const alturaCampo = 48;
export const alturaBotao = 52;
