// npm run celular: inicia o Expo para testar no celular (Expo Go).
// Com o hotspot do Windows ligado, o QR code aponta para ele (192.168.137.1).
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");

const HOTSPOT = "192.168.137.1";

// Endereço da API no .env.local ou no .env, como o Expo lê.
function enderecoDaApi() {
  for (const arquivo of [".env.local", ".env"]) {
    const texto = fs.existsSync(arquivo) ? fs.readFileSync(arquivo, "utf8") : "";
    const achado = /^EXPO_PUBLIC_API_URL=(.+)$/m.exec(texto);
    if (achado) return achado[1].trim().replace(/^["']|["']$/g, "");
  }
  return "http://localhost:3333";
}

const API = process.env.EXPO_PUBLIC_API_URL || enderecoDaApi();
const API_LOCAL = /\/\/(localhost|127\.0\.0\.1)\b/.test(API);

const ips = Object.values(os.networkInterfaces())
  .flat()
  .filter((rede) => rede && rede.family === "IPv4" && !rede.internal)
  .map((rede) => rede.address);

// "ok", "fora" ou "demorando". No plano grátis do Render, a API publicada dorme sem uso
// e leva cerca de 1 minuto para acordar; este pedido já começa a acordar a API.
function situacaoDaApi() {
  const pedido = fetch(`${API}/api/v1/termos`)
    .then((resposta) => (resposta.ok ? "ok" : "fora"))
    .catch(() => "fora");
  const espera = new Promise((resolver) =>
    setTimeout(() => resolver("demorando"), API_LOCAL ? 3000 : 10000),
  );
  return Promise.race([pedido, espera]);
}

async function iniciar() {
  const env = { ...process.env };

  if (ips.includes(HOTSPOT)) {
    env.REACT_NATIVE_PACKAGER_HOSTNAME = HOTSPOT;
    console.log("\nHotspot ligado: conecte o celular no Wi-Fi do hotspot e leia o QR code.");
  } else {
    console.log(
      "\nAviso: o hotspot do Windows está desligado." +
        "\n  Ligue em Configurações > Rede e Internet > Hotspot móvel, conecte o celular" +
        "\n  nele e rode npm run celular de novo. Sem o hotspot, o celular precisa estar" +
        "\n  na mesma rede do computador, e na rede da escola ele costuma ficar carregando.",
    );
  }

  const situacao = await situacaoDaApi();
  if (situacao !== "ok" && API_LOCAL) {
    console.log(
      `\nAviso: a API não respondeu em ${API}.` +
        "\n  Em outro terminal, na pasta NEXTPASS-BACKEND, rode: npm run dev",
    );
  } else if (situacao === "demorando") {
    console.log(
      `\nAviso: a API publicada (${API}) está acordando.` +
        "\n  No plano grátis do Render isso leva cerca de 1 minuto. Espere antes de abrir o app.",
    );
  } else if (situacao === "fora") {
    console.log(`\nAviso: a API publicada não respondeu em ${API}. Confira o endereço no .env.`);
  }

  // Roda o Expo do projeto direto pelo Node e repassa opções extras
  // (ex.: npm run celular -- --port 8090).
  const cli = require.resolve("expo/bin/cli");
  const expo = spawn(process.execPath, [cli, "start", "-c", ...process.argv.slice(2)], {
    stdio: "inherit",
    env,
  });
  expo.on("exit", (codigo) => process.exit(codigo ?? 0));
}

iniciar();
