# Nexocord

<div align="center">

# ⚡ NEXOCORD

### **V3.0.0**

**Build better Discord bots.**

Um framework moderno para criar bots Discord com TypeScript ou JavaScript, projetado para oferecer uma experiência de desenvolvimento organizada, tipada e escalável.

[📚 Documentação](https://nexocord.vercel.app/) · [📦 npm](https://www.npmjs.com/package/nexocord) · [🐛 Reportar problema](https://github.com/mitsukiie/NexoCord/issues)

<br />

![npm version](https://img.shields.io/npm/v/nexocord?style=for-the-badge&logo=npm&color=cb3837)
![npm downloads](https://img.shields.io/npm/dm/nexocord?style=for-the-badge&logo=npm)
![license](https://img.shields.io/npm/l/nexocord?style=for-the-badge)
![types](https://img.shields.io/npm/types/nexocord?style=for-the-badge&logo=typescript)

</div>

---

## 🚀 Sobre o projeto

O **Nexocord** é um framework construído sobre o [discord.js](https://discord.js.org/) para tornar o desenvolvimento de bots Discord mais organizado e produtivo.

Em vez de configurar manualmente toda a estrutura do projeto, você conta com uma arquitetura modular, carregamento automático de comandos e eventos, uma CLI própria e arquivos de configuração declarativos.

A proposta é simples: menos código repetitivo, mais foco na lógica do seu bot.

## ✨ Recursos

| Recurso | Descrição |
| --- | --- |
| ⚡ **CLI integrada** | Crie projetos e execute tarefas diretamente pelo terminal. |
| 📂 **Carregamento automático** | Organize comandos e eventos em arquivos separados. |
| 🧠 **TypeScript-first** | Tipagem para uma experiência de desenvolvimento mais segura. |
| 🧩 **Components V2** | Construa interfaces interativas para suas mensagens Discord. |
| 🔄 **Node.js e Bun** | Escolha o runtime que combina com seu projeto. |
| 📦 **ESM e CommonJS** | Suporte aos formatos de módulos disponibilizados pelo pacote. |
| ⚙️ **Configuração declarativa** | Configure diretórios, terminal e comportamento do bot em `nexocord.json` ou `nexocord.config`. |
| 🛠️ **Ferramentas de desenvolvimento** | Execute, compile e diagnostique seu projeto usando a CLI. |

## 📦 Instalação

Requisitos: **Node.js 20 ou superior** ou um ambiente Bun compatível com o seu projeto.

Instale a CLI para utilizar os comandos `nexo`:

```bash
npm install --global nexocord
```

Para criar um projeto novo:

```bash
nexo create meu-bot
cd meu-bot
nexo dev
```

Para instalar o Nexocord em um projeto existente:

```bash
npm install nexocord discord.js
nexo init
```

Você também pode utilizar o gerenciador de pacotes e o runtime de sua preferência.

Depois, escolha a linguagem e o runtime de forma interativa ou informe as opções diretamente:

```bash
nexo init --language ts --runtime node
nexo init --language js --runtime bun
```

O comando preserva arquivos existentes e só altera configurações do projeto quando necessário.

## 🧰 CLI

O Nexocord inclui comandos para acompanhar todo o ciclo de desenvolvimento.

| Comando | Descrição |
| --- | --- |
| `nexo create <nome>` | Cria um novo projeto. |
| `nexo init` | Adiciona o Nexocord a um projeto existente. |
| `nexo dev` | Executa o projeto em desenvolvimento. |
| `nexo build` | Compila o projeto para produção. |
| `nexo start` | Executa o projeto preparado para produção. |
| `nexo doctor` | Verifica possíveis problemas na configuração. |
| `nexo info` | Exibe informações do ambiente e do projeto. |
| `nexo update` | Executa o fluxo de atualização disponibilizado pela CLI. |

### Configure o projeto com `nexo init`

O comando `init` permite selecionar interativamente a linguagem e o runtime, além de detectar configurações existentes.

Você também pode informar as opções diretamente:

```bash
nexo init --language ts --runtime node
nexo init --language js --runtime bun
```

Opções disponíveis:

- `--language ts`: TypeScript.
- `--language js`: JavaScript.
- `--runtime node`: Node.js.
- `--runtime bun`: Bun.

O comando procura preservar arquivos e scripts existentes e evita sobrescrever arquivos de projeto sem necessidade.

### Desenvolvimento e produção

```bash
# Desenvolvimento
nexo dev

# Desenvolvimento com watch mode
nexo dev --watch

# Compilação
nexo build

# Execução em produção
nexo start
```

O comportamento de compilação e execução depende da linguagem, do runtime e da configuração do projeto.

## ⚙️ Configuração

O NexoCord procura automaticamente a configuração na raiz do projeto. Utilize apenas um dos formatos:

### `nexocord.json`

```json
{
  "directories": {
    "commands": "./src/commands",
    "events": "./src/events"
  },
  "terminal": {
    "mode": "minimalista",
    "commands": {
      "showFiles": false,
      "showRegistered": true,
      "registeredMessage": "{count} comandos registrados"
    },
    "events": {
      "showFiles": false,
      "showRegistered": true,
      "registeredMessage": "{count} eventos carregados"
    }
  },
  "bot": {
    "cooldown": 3,
    "guildID": [],
    "errors": {
      "interaction": "Ocorreu um erro ao executar este comando."
    }
  }
}
```

Sem arquivo de configuração, os diretórios padrão são `src/commands` e `src/events`.

Crie um arquivo `.env` na raiz do projeto para o token:

```env
TOKEN=seu_token_aqui
```

O token também pode ser informado diretamente em `Bootstrap.init()`, embora uma variável de ambiente seja recomendada:

```ts
import { Bootstrap, GatewayIntentBits } from "nexocord";

await Bootstrap.init({
  token: process.env.TOKEN,
  intents: [GatewayIntentBits.Guilds],
});
```

Mantenha o token privado e adicione os arquivos de ambiente ao `.gitignore`:

```gitignore
.env
.env.*
!.env.example
```

Consulte o [guia completo de configuração](https://nexocord.vercel.app/docs/guia/configuration).

## 🧩 Criando comandos

Os comandos são carregados automaticamente a partir de `directories.commands` e devem exportar sua definição como `default`:

```ts
import { CommandType, createCommand } from "nexocord";

export default createCommand({
  name: "ping",
  description: "Verifica se o bot está online.",
  type: CommandType.ChatInput,
  async run(ctx) {
    await ctx.reply({ content: "Pong!" });
  },
});
```

Eventos seguem o mesmo padrão em `directories.events`:

```ts
import { createEvent, Events } from "nexocord";

export default createEvent({
  name: Events.ClientReady,
  once: true,
  run(client) {
    console.log(`${client.user.displayName} online.`);
  },
});
```

## 🧩 Components V2

O Nexocord oferece uma API de construção de interfaces baseada nos Components V2 do Discord, permitindo compor mensagens com elementos como textos, divisores, botões, seções e outros componentes suportados pela biblioteca.

Exemplo ilustrativo:

```ts
const components = [
  ui.text("## Meu painel"),
  ui.divider(),
];

await ctx.reply({ components });
```

A API de Components V2 do Nexocord é própria do framework. Consulte a documentação para conhecer as assinaturas, opções e limitações de cada componente.

📚 **[Ver documentação de Components V2](https://nexocord.vercel.app/docs/components-v2)**

## 📂 Organização do projeto

Um projeto criado pelo template pode seguir uma estrutura modular como esta:

```text
meu-bot/
├── src/
│   ├── commands/
│   │   └── utils/
│   │       └── ping.ts
│   ├── events/
│   │   └── ready.ts
│   └── index.ts
├── package.json
└── .env
```

- **`commands/`** — comandos do bot.
- **`events/`** — eventos do Discord.
- **`index.ts`** — ponto de entrada do projeto.

A extensão dos arquivos depende da linguagem escolhida durante a configuração.

## 🔥 O que mudou na V3?

A versão **3.0.0** atualiza a forma de configurar e inicializar projetos:

- A configuração principal agora utiliza `nexocord.json` ou `nexocord.config`.
- Os diretórios são definidos em `directories.commands` e `directories.events`.
- As opções de terminal ficam em `terminal.commands` e `terminal.events`.
- O token padrão é lido de `process.env.TOKEN`.
- A CLI oferece `nexo create` para projetos novos e `nexo init` para projetos existentes.

Projetos da v2 que utilizavam `paths` ou configurações inline antigas devem migrar para o formato atual. Consulte a [documentação de configuração](https://nexocord.vercel.app/docs/guia/configuration) e o [guia de migração](https://nexocord.vercel.app/docs/migration).

> **Atenção:** a v3 contém mudanças incompatíveis com versões anteriores. Revise a configuração do projeto antes de atualizar.

## 📚 Documentação

Aprenda a instalar, configurar e utilizar os recursos do framework.

- 🌐 **Site oficial:** [nexocord.vercel.app](https://nexocord.vercel.app/)
- 📦 **Pacote npm:** [npmjs.com/package/nexocord](https://www.npmjs.com/package/nexocord)
- 💻 **Código-fonte:** [github.com/mitsukiie/NexoCord](https://github.com/mitsukiie/NexoCord)
- 🐛 **Problemas e sugestões:** [GitHub Issues](https://github.com/mitsukiie/NexoCord/issues)

## 🤝 Contribuindo

Sugestões, correções e contribuições são bem-vindas!

1. Faça um fork do repositório.
2. Crie uma branch para sua alteração.
3. Implemente e teste suas mudanças.
4. Abra um Pull Request com uma descrição clara.

Para relatar um problema, utilize a seção de [Issues](https://github.com/mitsukiie/NexoCord/issues).

## 📄 Licença

O Nexocord é distribuído sob a licença [MIT](LICENSE).

Você pode utilizar, modificar e redistribuir o projeto de acordo com os termos da licença.

---

<div align="center">

**Nexocord — Menos boilerplate. Mais possibilidades. ⚡**

Feito com dedicação por [Mitsuki](https://github.com/mitsukiie).

</div>
