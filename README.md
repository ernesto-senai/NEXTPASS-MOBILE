# NextPass · App

App mobile do NextPass (TCC) para atletas, olheiros e responsáveis.

**Stack:** Expo SDK 57 · React Native 0.86 · TypeScript 6 · Expo Router · TanStack Query · Zustand · Expo SecureStore

## Como rodar

```bash
cp .env.example .env     # EXPO_PUBLIC_API_URL com o IP da sua máquina na rede
npm install
npm start                # leia o QR code com o Expo Go (Android ou iOS)
```

A API precisa estar rodando (veja `../NEXTPASS-BACKEND`). No celular, `localhost` é o próprio aparelho: use o IP da máquina na rede local.

| Script | O que faz |
| --- | --- |
| `start` / `android` / `ios` | Sobe o Metro (Expo Go) |
| `typecheck` | Checa os tipos, inclusive as rotas tipadas do Expo Router |
| `lint` | ESLint com a configuração do Expo |

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
├── lib/                      Configuração de bibliotecas (QueryClient)
├── theme/                    Cores, espaçamentos e medidas da identidade visual (RNF-13, RNF-14)
└── types/                    Contratos da API (enums e envelopes), espelhando o backend
```

**Regra de dependência:** `app → features → services/store/components → theme/types`. Uma tela nunca chama `fetch` direto: ela usa um hook da feature, que usa o cliente de `services/api`.

**Estado:** o que vem da API fica no cache do TanStack Query, e só a sessão fica no Zustand. Os tokens ficam no SecureStore (Keychain/Keystore) e só persistem com "Lembrar de mim" marcado (RF-03).

**Perfis:** o `Stack.Protected` do layout raiz libera a área de cada perfil (`atleta/`, `olheiro/`, `responsavel/`), e cada área tem o próprio `(tabs)`. O menu inferior é o mesmo para atleta e olheiro (Feed, Pesquisa, Publicar, Notificações, Perfil), mas cada perfil tem telas diferentes em cada aba.

**Deep links:** o scheme `nextpass://` abre `redefinir-senha` e `confirmar-vinculo` a partir dos e-mails (RF-05, RF-48).

### Responsividade e toque (mobile-first)

As regras ficam em `src/theme` e `src/hooks/use-layout-responsivo.ts`, e os componentes de `src/components/ui` já as seguem:

- **Uma coluna por padrão.** Nada tem largura fixa, e o layout funciona a partir de 320px sem rolagem horizontal.
- **Telas compactas (< 360px):** margens de 16px, espaços menores, marca reduzida, ícones decorativos ocultos e opções empilhadas.
- **Telas largas (≥ 600px, tablet e navegador):** o formulário vira um cartão centralizado de até 440px, e os feeds ficam numa coluna centralizada de até 640px.
- **Feeds:** o card da peneira empilha as vagas e o botão em telas compactas. As abas usam rótulos curtos no celular ("Abertas"). Cada lance do olheiro ocupa a tela, toca sem som e liga o som ao tocar nele.
- **Toque:** botões, links, caixas de seleção e o botão de mostrar senha têm pelo menos 44px de altura (RNF-14); campos têm 48px.
- **Fontes:** inputs e placeholders usam 16px, o que evita o zoom automático do Safari no iOS (versão web).
- **Formulários:** usam `react-hook-form` + `zod`, com todos os erros mostrados de uma vez no envio (RNF-15). Os erros da API, como e-mail já cadastrado, aparecem no próprio campo.

### Próximas dependências (entram com cada feature)

`expo-image-picker` (envio de lances), `expo-notifications` (push, RF-53) e `expo-auth-session` (login com Google, RF-04). A compressão de vídeo no aparelho (RNF-04) pode exigir um development build em vez do Expo Go, então vale decidir isso cedo.
