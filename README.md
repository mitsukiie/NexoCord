# ⚡ NexoCord

<div align="center">

### **v3.1.3**

**Build better Discord bots.**

Um framework para desenvolver bots Discord com TypeScript ou JavaScript, oferecendo uma estrutura organizada, ferramentas próprias e uma experiência de desenvolvimento mais simples.

[📚 Documentação](https://nexocord.vercel.app/) · [📦 npm](https://www.npmjs.com/package/nexocord) · [🐛 Issues](https://github.com/mitsukiie/NexoCord/issues)

<br />

![npm version](https://img.shields.io/npm/v/nexocord?style=for-the-badge&logo=npm&color=cb3837)
![npm downloads](https://img.shields.io/npm/dm/nexocord?style=for-the-badge&logo=npm)
![license](https://img.shields.io/npm/l/nexocord?style=for-the-badge)
![types](https://img.shields.io/npm/types/nexocord?style=for-the-badge&logo=typescript)

</div>

---

## 🚀 Sobre

O **NexoCord** é um framework construído sobre o [discord.js](https://discord.js.org/) que simplifica o desenvolvimento de bots Discord.

Com uma CLI própria, carregamento automático de comandos e eventos, suporte a TypeScript e JavaScript e uma API para Components V2, você pode focar no que realmente importa: desenvolver seu bot.

## ✨ Recursos

- ⚡ **CLI própria:** crie, configure e gerencie seus projetos.
- 📂 **Carregamento automático:** organize comandos e eventos em arquivos separados.
- 🧠 **TypeScript e JavaScript:** escolha a linguagem do seu projeto.
- 🧩 **Components V2:** construa interfaces interativas para o Discord.
- 🔄 **Node.js e Bun:** escolha seu runtime.
- ⚙️ **Configuração flexível:** personalize seu projeto com `nexocord.json`.
- 🛠️ **Ferramentas de desenvolvimento:** execute, compile e diagnostique seu projeto.

## 📦 Instalação

Requisitos: Node.js 20 ou superior ou Bun.

Instale a CLI globalmente:

```bash
npm install --global nexocord
```

### Criando um projeto

```bash
nexo create meu-bot
cd meu-bot
nexo dev
```

### Adicionando a um projeto existente

```bash
npm install nexocord discord.js
nexo init
```

O comando `init` configura o NexoCord em um projeto existente, detectando configurações e permitindo escolher a linguagem e o runtime.

Você também pode informar essas opções diretamente:

```bash
nexo init --language ts --runtime node
nexo init --language js --runtime bun
```

## 🧰 CLI

| Comando              | Descrição                                       |
| -------------------- | ----------------------------------------------- |
| `nexo create <nome>` | Cria um novo projeto.                           |
| `nexo init`          | Configura um projeto existente.                 |
| `nexo dev`           | Executa o projeto em desenvolvimento.           |
| `nexo build`         | Compila o projeto.                              |
| `nexo start`         | Inicia o projeto em produção.                   |
| `nexo doctor`        | Verifica possíveis problemas.                   |
| `nexo info`          | Exibe informações do projeto.                   |
| `nexo update`        | Executa a atualização disponibilizada pela CLI. |

## 💻 Exemplo

Um comando simples utilizando o NexoCord:

```ts
import { CommandType, createCommand } from 'nexocord';

export default createCommand({
  name: 'ping',
  description: 'Verifica se o bot está online.',
  type: CommandType.ChatInput,

  async run(interaction) {
    await interaction.reply({
      content: 'Pong! 🏓',
    });
  },
});
```

O NexoCord também disponibiliza uma API própria para construir mensagens com Components V2:

```ts
async run(interaction, client, { ui }) {
  await interaction.reply({
    components: [
      ui.container(
        ui.text("## Olá, Discord!"),
      ),
    ],
  });
}
```

## ⚙️ Configuração

O NexoCord permite personalizar o funcionamento do projeto através do arquivo `nexocord.json` ou `nexocord.config`.

Também é possível configurar diretórios, mensagens do terminal, cooldowns e outras opções do bot.

Para autenticar seu bot, crie um arquivo `.env` na raiz do projeto:

```env
TOKEN=seu_token_aqui
```

Inicialize o bot:

```ts
import { Bootstrap, GatewayIntentBits } from 'nexocord';

await Bootstrap.init({
  token: process.env.TOKEN,
  intents: [GatewayIntentBits.Guilds],
});
```

Consulte a documentação para conhecer todas as opções de configuração.

## 📚 Documentação

Quer conhecer melhor o NexoCord?

Acesse a documentação oficial para encontrar guias, exemplos e referências de todas as funcionalidades.

**[Acessar documentação →](https://nexocord.vercel.app/)**

## 🤝 Contribuindo

Contribuições são bem-vindas!

1. Faça um fork do repositório.
2. Crie uma branch para sua alteração.
3. Implemente e teste suas mudanças.
4. Abra um Pull Request.

Encontrou algum problema? Abra uma [Issue](https://github.com/mitsukiie/NexoCord/issues).

## 📄 Licença

Distribuído sob a licença [MIT](LICENSE).

---

<div align="center">

**NexoCord — Menos boilerplate. Mais possibilidades. ⚡**

Feito com dedicação por [Mitsuki](https://github.com/mitsukiie).

</div>
