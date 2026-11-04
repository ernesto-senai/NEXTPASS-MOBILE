// Inicia o Expo para abrir o app no celular pelo Expo Go (Android ou iOS).
// Uso: npm run celular. Com o hotspot do Windows ligado, o QR code aponta para
// ele (192.168.137.1), que funciona mesmo com o firewall da rede da escola.
// Sem o hotspot, o Expo usa o IP da rede do computador e o aviso abaixo explica
// por que o celular pode ficar carregando.
const { spawn } = require("node:child_process");
const http = require("node:http");
const os = require("node:os");

const HOTSPOT = "192.168.137.1";

const ips = Object.values(os.networkInterfaces())
  .flat()
  .filter((rede) => rede && rede.family === "IPv4" && !rede.internal)
  .map((rede) => rede.address);

function apiNoAr() {
  return new Promise((resolver) => {
    const pedido = http.get("http://localhost:3333/api/v1/termos", (resposta) => {
      resposta.resume();
      resolver(resposta.statusCode === 200);
    });
    pedido.on("error", () => resolver(false));
    pedido.setTimeout(3000, () => {
      pedido.destroy();
      resolver(false);
    });
  });
}

async function iniciar() {
  const env = { ...process.env };

  if (ips.includes(HOTSPOT)) {
    env.REACT_NATIVE_PACKAGER_HOSTNAME = HOTSPOT;
    console.log(`\n✔ Hotspot ligado: conecte o celular no Wi-Fi do hotspot e leia o QR code.`);
  } else {
    console.log(
      "\n⚠ O hotspot do Windows está desligado." +
        "\n  Ligue em Configurações > Rede e Internet > Hotspot móvel, conecte o celular" +
        "\n  nele e rode npm run celular de novo. Sem o hotspot, o celular precisa estar" +
        "\n  na mesma rede do computador, e na rede da escola ele costuma ficar carregando.",
    );
  }

  if (!(await apiNoAr())) {
    console.log(
      "\n⚠ A API não respondeu em http://localhost:3333." +
        "\n  Em outro terminal, na pasta NEXTPASS-BACKEND, rode: npm run dev",
    );
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
