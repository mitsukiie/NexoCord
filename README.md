# Nexocord
![npm](https://img.shields.io/npm/v/nexocord)
![downloads](https://img.shields.io/npm/dm/nexocord)
![license](https://img.shields.io/npm/nexocord)
![types](https://img.shields.io/npm/types/nexocord)

Nexocord é um framework para criação de bots Discord modernos usando TypeScript ou JavaScript, focado em organização, produtividade e escalabilidade desde o primeiro arquivo.

## 📚 Documentação
- Site oficial: https://nexocord.vercel.app/
- Repositório: https://github.com/mitsukiie/NexoCord

## ✨ Features
- ⚡ Setup em segundos
- 📂 Auto carregamento de comandos e eventos
- 🧠 API tipada
- 🧰 CLI integrada
- 🔄 Compatível com Node.js e Bun
- 📦 Suporte a ESM e CommonJS

## 🤔 Por que usar Nexocord?

Criar bots apenas com discord.js exige estrutura manual,
carregamento de arquivos e muito boilerplate.

O Nexocord resolve isso oferecendo:

- estrutura pronta
- carregamento automático
- padrão escalável
- experiência moderna de desenvolvimento



## 📦 Instalação

```bash
npm install nexocord discord.js
```

## ⚙️ Configuração
Crie um arquivo .env:
```txt
TOKEN=seu_token_aqui
```

## ⚡ Início rápido (JavaScript)

Crie um arquivo de entrada (exemplo: `src/index.js`):

```js
const { Bootstrap } = require('nexocord');
const { GatewayIntentBits } = require('discord.js');

async function main() {
    await Bootstrap.init({
        token: process.env.TOKEN,
        intents: [GatewayIntentBits.Guilds],
        paths: {
            commands: 'src/commands',
            events: 'src/events',
        },
    });
}

main()
```


### 📝 Exemplo de comando

`src/commands/util/ping.ts`

```ts
const { createCommand, CommandType } = require('nexocord');

module.exports = createCommand({
    name: 'ping',
    description: 'Responde com pong!',
    type: CommandType.ChatInput,
    async run(interaction) {
        await interaction.reply({ content: 'Pong!' });
    },
});
```

### 📡 Exemplo de evento

`src/events/ready.ts`

```ts
const { createEvent } = require('nexocord');

module.exports = createEvent({
    name: 'ready',
    once: true,
    run(client) {
        console.log(`Bot ${client.user?.username} está online!`);
    },
});
```

## 🧰 CLI
O Nexocord inclui uma CLI própria.

```bash
# desenvolvimento
npx nexo dev

# arquivo customizado
npx nexo dev src/index.ts

# watch mode
npx nexo dev --watch

# produção
npx nexo start dist/bot.js
```

## 📂 Estrutura sugerida

```txt
src/
  commands/
    util/
      ping.ts
  events/
    ready.ts
  index.ts
```

## 🚧 Status do projeto

O Nexocord está em desenvolvimento ativo.
Feedbacks e contribuições são bem-vindos!

## Licença

MIT. Veja o arquivo `LICENSE`.