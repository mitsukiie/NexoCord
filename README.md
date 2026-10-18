# Nexocord

<div align="center">

# ⚡ NEXOCORD

### **V2.0.0**

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

Em vez de configurar manualmente toda a estrutura do projeto, você conta com uma arquitetura modular, carregamento automático de comandos e eventos, uma CLI própria e ferramentas para simplificar o desenvolvimento.

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
| 🛠️ **Ferramentas de desenvolvimento** | Execute, compile e diagnostique seu projeto usando a CLI. |

## 📦 Instalação

Requisitos: **Node.js 20 ou superior** ou um ambiente Bun compatível com o seu projeto.

Para instalar o Nexocord em um projeto existente:

```bash
npm install nexocord discord.js
```

Para instalar a CLI globalmente:

```bash
npm install --global nexocord
```

Você também pode utilizar o gerenciador de pacotes e o runtime de sua preferência.

## ⚡ Comece em segundos

Crie seu primeiro projeto com a CLI:

```bash
nexo create meu-bot
cd meu-bot
nexo dev
```

Pronto! A CLI prepara a estrutura inicial para você começar a desenvolver.

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

## ⚙️ Configuração

Crie um arquivo `.env` na raiz do projeto:

```env
TOKEN=seu_token_aqui
```

Mantenha seu token privado. Nunca publique credenciais no GitHub nem as inclua diretamente no código-fonte.

Adicione arquivos de ambiente ao `.gitignore`:

```gitignore
.env
.env.*
!.env.example
```

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

## 🔥 O que esperar da V2.0.0?

A versão **2.0.0** marca uma nova etapa para o Nexocord, com mudanças importantes na forma de criar comandos e construir interfaces com Components V2.

Por envolver mudanças na API, exemplos e implementações feitos para versões anteriores podem precisar de ajustes.

Antes de atualizar um projeto existente, consulte a documentação correspondente à versão instalada e as notas de migração.

> **Atenção:** a versão 2.0.0 deve ser tratada como uma atualização potencialmente incompatível (*breaking change*). Publique as notas definitivas de migração junto com a versão oficial.

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
