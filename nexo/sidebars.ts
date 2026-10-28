import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    {
      type: "category",
      label: "🚀 Começando",
      items: [
        "comecando/introducao",
        "comecando/instalacao",
        "comecando/primeiro-bot",
      ],
    },
    {
      type: "category",
      label: "📘 Guia",
      items: [
        "guia/comandos",
        "guia/opcoes",
        "guia/eventos",
        "guia/responders",
        "guia/components-v2",
        "guia/configuracao",
      ],
    },
    {
      type: "category",
      label: "🛠️ CLI",
      items: [
        "cli/visao-geral",
        "cli/init",
        "cli/create",
        "cli/dev",
        "cli/build",
        "cli/start",
        "cli/doctor",
        "cli/info",
        "cli/update",
      ],
    },
    {
      type: "category",
      label: "🔎 Referência",
      items: [
        "referencia/migracao",
        "referencia/solucao-de-problemas",
      ],
    },
  ],
};

export default sidebars;