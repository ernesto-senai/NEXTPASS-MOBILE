// Configuração do Metro (o servidor do Expo). Além do padrão, ele repassa
// para a API os pedidos que o app faz no celular a /api/ e /uploads/. Assim o
// celular só precisa alcançar a porta do Expo, a mesma que já entrega o
// código do app: firewalls como o da rede da escola bloqueiam a porta 3333.
const http = require("node:http");
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);
const api = new URL(process.env.EXPO_PUBLIC_API_URL || "http://localhost:3333");
const ROTAS_DA_API = ["/api/", "/uploads/"];

const padrao = config.server.enhanceMiddleware;
config.server.enhanceMiddleware = (metro, servidor) => {
  const proximo = padrao ? padrao(metro, servidor) : metro;
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
