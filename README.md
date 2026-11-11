# NextPass - App

App mobile do NextPass (TCC) para atletas, olheiros e responsáveis.

**Stack:** Expo SDK 58, React Native 0.88, TypeScript 6, Expo Router, TanStack Query, Zustand e Expo SecureStore

## Como rodar

```bash
cp .env.example .env     # já vem com http://localhost:3333
npm install
npm run celular          # leia o QR code com o Expo Go (Android ou iOS)
```

A API precisa estar rodando (veja `../NEXTPASS-BACKEND`). O `.env` fica com `localhost` mesmo para o celular: o app fala com a API pelo próprio Expo, que repassa `/api` e `/uploads` para ela (`metro.config.js`). Assim o celular só precisa acessar a porta do Expo (8081).

**No celular:** ligue o hotspot do Windows (Configurações > Rede e Internet > Hotspot móvel), conecte o celular nele e rode `npm run celular`. Na rede da escola o celular não costuma alcançar o computador, por isso o hotspot. O script avisa se o hotspot estiver desligado ou se a API não responder.

**No navegador do computador:** `npx expo start --web` abre o app em `http://localhost:8081`.

**Com a API publicada:** troque o `EXPO_PUBLIC_API_URL` do `.env` pelo endereço dela no Render (veja o README da API). O app passa a falar direto com ela, e todos os computadores e celulares veem os mesmos lances, perfis e avaliações. No Expo Go, o código do app ainda vem do computador pelo `npm run celular`.

O `.env` e a pasta `.expo/` não vão para o GitHub: cada um tem o seu. Os tipos das rotas (`.expo/types`) são gerados na primeira vez que o Expo sobe.

| Script                      | O que faz                                                     |
| --------------------------- | ------------------------------------------------------------- |
| `celular`                   | Sobe o Expo para o celular (usa o hotspot, se estiver ligado) |
| `start` / `android` / `ios` | Sobe o Metro (Expo Go)                                        |
| `typecheck`                 | Checa os tipos, inclusive as rotas tipadas do Expo Router     |
| `lint`                      | ESLint com a configuração do Expo                             |

## Versão web publicada

O mesmo código roda no navegador. O `render.yaml` deste repositório cria no Render um site estático (plano grátis) com `npx expo export --platform web`, e qualquer computador ou celular abre o app pelo endereço do site, sem instalar nada.

1. No Render: **New > Blueprint**, escolha este repositório e informe o `EXPO_PUBLIC_API_URL`: o endereço da API publicada, sem `/api/v1` e sem barra no fim.
2. Na API, coloque o endereço do site, sem barra no fim, no `CORS_ORIGINS` e no `APP_URL`.
3. A cada push na branch escolhida, o Render gera o site de novo.

## Arquitetura

As rotas ficam em `src/app` (Expo Router: cada arquivo é uma tela), e a lógica de cada domínio fica em `src/features`, espelhando os módulos da API.

```
src/
├── app/                      Rotas: telas finas que usam componentes e hooks das features
│   ├── _layout.tsx           Providers e rotas protegidas por perfil (Stack.Protected)
│   ├── index.tsx             Redireciona para a área do perfil logado
│   ├── (auth)/               Login, cadastro, senha e vínculo do responsável
│   ├── atleta/               Área do atleta: (tabs)/ com o menu inferior e telas internas
│   ├── olheiro/              Área do olheiro: (tabs)/, verificação, convite, participantes
│   ├── responsavel/          Supervisão de convites e inscrições
│   ├── avaliacoes/[id].tsx   Detalhes da avaliação (qualquer perfil logado)
│   └── denunciar.tsx         Modal de denúncia (RF-54)
├── features/<dominio>/       Chamadas à API, hooks do TanStack Query e componentes do domínio
├── components/
│   ├── ui/                   Componentes visuais reutilizáveis (Tela, botões, campos...)
│   └── navigation/           Menu inferior (RF-51) e cabeçalho padrão
├── services/api/             Cliente HTTP: base URL, token Bearer e erros { codigo, mensagem }
├── store/                    Estado global do cliente (sessão, em Zustand + SecureStore)
├── hooks/                    Hooks gerais (layout responsivo e debounce das buscas)
├── lib/                      QueryClient, formatadores, máscaras, datas e rótulos
├── theme/                    Cores, espaçamentos e medidas da identidade visual (RNF-13, RNF-14)
└── types/                    Contratos da API (enums e envelopes), espelhando o backend
```

**Regra de dependência:** as telas (`app`) usam as `features`, que usam `services`, `store` e `components`, e todos podem usar `theme` e `types`. Uma tela nunca chama `fetch` direto: ela usa um hook da feature, que usa o cliente de `services/api`.

**Estado:** o que vem da API fica no cache do TanStack Query, e só a sessão fica no Zustand. Os tokens ficam no SecureStore (Keychain/Keystore) e só persistem com "Lembrar de mim" marcado (RF-03).

**Perfis:** o `Stack.Protected` do layout raiz libera a área de cada perfil (`atleta/`, `olheiro/`, `responsavel/`), e cada área tem o próprio `(tabs)`. O menu inferior é o mesmo para atleta e olheiro (Feed, Pesquisa, Publicar, Notificações, Perfil), mas cada perfil tem telas diferentes em cada aba.

**Deep links:** o scheme `nextpass://` abre `confirmar-vinculo`, o link enviado ao responsável (RF-48). O "Esqueceu sua senha?" é simulado: a tela confere o e-mail e mostra a confirmação do envio (RF-05).

### Responsividade e toque (mobile-first)

As regras ficam em `src/theme` e `src/hooks/use-layout-responsivo.ts`, e os componentes de `src/components/ui` já as seguem:

- **Uma coluna por padrão.** Nada tem largura fixa, e o layout funciona a partir de 320px sem rolagem horizontal.
- **Telas compactas (menos de 360px):** margens de 16px, espaços menores, marca reduzida, ícones decorativos ocultos e opções empilhadas.
- **Telas largas (a partir de 600px, tablet e navegador):** o formulário vira um cartão centralizado de até 440px, e os feeds ficam numa coluna centralizada de até 640px.
- **Feeds:** o card da peneira empilha as vagas e o botão em telas compactas. As abas usam rótulos curtos no celular ("Abertas"). No feed do olheiro, os lances aparecem em ordem aleatória, primeiro os que ele ainda não viu, e puxar o primeiro para baixo sorteia outra ordem. O lance gravado em pé ocupa a tela inteira e o deitado aparece inteiro, no meio da tela. O vídeo começa sem som, e o som liga com um toque. No perfil, o carrossel de destaques também mostra o vídeo inteiro.
- **Toque:** botões, links, caixas de seleção e o botão de mostrar senha têm pelo menos 44px de altura (RNF-14); campos têm 48px.
- **Fontes:** inputs e placeholders usam 16px, o que evita o zoom automático do Safari no iOS (versão web).
- **Formulários:** usam `react-hook-form` + `zod`, com todos os erros mostrados de uma vez no envio (RNF-15). Os erros da API, como e-mail já cadastrado, aparecem no próprio campo.

### Fora do escopo do TCC (trabalhos futuros)

- **Login com Google (RF-04, RF-12)** e **notificações push (RF-53):** exigiriam `expo-auth-session`, `expo-notifications` e um development build (o Expo Go não recebe push). Os avisos ficam na aba Notificações.
- **Compressão de vídeo no Android (RNF-04):** no iOS a galeria já entrega o vídeo em 720p; no Android o app confere o limite de 50 MB antes do envio. Comprimir exigiria uma biblioteca nativa e um development build.
