// Metro (servidor do Expo) repassando /api/ e /uploads/ para a API deste computador.
// Assim o celular só precisa acessar a porta do Expo (o firewall da escola bloqueia a 3333).
const http = require("node:http");
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);
const api = new URL(process.env.EXPO_PUBLIC_API_URL || "http://localhost:3333");
const ROTAS_DA_API = ["/api/", "/uploads/"];

// Com a API publicada na internet, o app fala direto com ela e o repasse não é usado.
const apiLocal = ["localhost", "127.0.0.1"].includes(api.hostname);

const padrao = config.server.enhanceMiddleware;
config.server.enhanceMiddleware = (metro, servidor) => {
  const proximo = padrao ? padrao(metro, servidor) : metro;
  if (!apiLocal) return proximo;
  return (req, res, next) => {
    if (!ROTAS_DA_API.some((rota) => req.url?.startsWith(rota))) return proximo(req, res, next);

    const pedido = http.request(
      {
        hostname: api.hostname,
        port: api.port,
        path: req.url,
        method: req.method,
        headers: { ...req.headers, host: api.host },
      },
      (resposta) => {
        res.writeHead(resposta.statusCode ?? 502, resposta.headers);
        resposta.pipe(res);
      },
    );
    // Mesmo formato de erro da API, para o app mostrar a mensagem certa.
    pedido.on("error", () => {
      res.writeHead(502, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          erro: { codigo: "API_FORA_DO_AR", mensagem: "A API não está rodando no computador." },
        }),
      );
    });
    req.pipe(pedido);
  };
};

module.exports = config;
