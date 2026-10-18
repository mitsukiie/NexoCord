
import type { ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function CodePreview() {
  return (
    <div className={styles.codeWindow}>
      <div className={styles.codeHeader}>
        <div className={styles.windowDots}>
          <span />
          <span />
          <span />
        </div>
        <span className={styles.codeFilename}>src/commands/hello.ts</span>
        <span className={styles.codeBadge}>TypeScript</span>
      </div>

      <pre className={styles.code}>
        <code>
          <span className={styles.purple}>import</span>
          {' { createCommand } '}
          <span className={styles.purple}>from</span>
          {' '}
          <span className={styles.green}>'nexocord'</span>
          {';\n\n'}

          <span className={styles.purple}>export default</span>
          {' createCommand({\n'}
          {'  name: '}
          <span className={styles.green}>'hello'</span>
          {',\n'}
          {'  description: '}
          <span className={styles.green}>'Meu primeiro comando'</span>
          {',\n\n'}
          {'  '}
          <span className={styles.purple}>async</span>
          {' run(ctx) {\n'}
          {'    '}
          <span className={styles.purple}>const</span>
          {' components = [\n'}
          {'      ui.text('}
          <span className={styles.green}>'Olá Mundo! 👋'</span>
          {'),\n'}
          {'    ];\n\n'}
          {'    '}
          <span className={styles.purple}>await</span>
          {' ctx.reply({ components });\n'}
          {'  },\n'}
          {'});'}
        </code>
      </pre>

      <div className={styles.codeFooter}>
        <span><span className={styles.statusDot} /> Exemplo de comando</span>
        <span>Nexocord</span>
      </div>
    </div>
  );
}

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <header className={styles.hero}>
      <div className={styles.heroGrid} />
      <div className={styles.glow} />

      <div className={clsx('container', styles.heroContainer)}>
        <div className={styles.heroContent}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowDot} />
            Discord bot framework
          </div>

          <Heading as="h1" className={styles.heroTitle}>
            Crie bots para Discord.
            <br />
            <span>Do seu jeito.</span>
          </Heading>

          <p className={styles.heroDescription}>
            Um fluxo organizado para desenvolver comandos, eventos,
            responders e interfaces interativas com JavaScript ou
            TypeScript.
          </p>

          <div className={styles.buttons}>
            <Link
              className={clsx('button button--lg', styles.primaryButton)}
              to="/docs/introduction">
              Começar agora <span aria-hidden="true">→</span>
            </Link>

            <Link
              className={clsx('button button--lg', styles.secondaryButton)}
              to="/docs/installation">
              Ver instalação
            </Link>
          </div>

          <div className={styles.heroMeta}>
            <span>⌘ JavaScript</span>
            <span>⌘ TypeScript</span>
            <span>⚡ Node.js e Bun</span>
          </div>
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.visualGlow} />
          <CodePreview />
          <div className={styles.floatingTag}>
            <span>✦</span> Código organizado, sem complicação.
          </div>
        </div>
      </div>

      <div className={styles.heroBottom}>
        <div className="container">
          <span>FEITO PARA QUEM CONSTRÓI</span>
          <span>Comandos</span>
          <span>Eventos</span>
          <span>Responders</span>
          <span>Components V2</span>
        </div>
      </div>
    </header>
  );
}

const features = [
  {
    number: '01',
    icon: '⌘',
    title: 'Comandos organizados',
    description:
      'Estruture seus comandos em arquivos independentes, com uma API consistente e fácil de manter.',
    tag: 'COMMANDS',
  },
  {
    number: '02',
    icon: '↯',
    title: 'Eventos sem complicação',
    description:
      'Reaja aos eventos do Discord e mantenha a lógica do seu bot organizada.',
    tag: 'EVENTS',
  },
  {
    number: '03',
    icon: '◈',
    title: 'Interações personalizadas',
    description:
      'Crie responders para botões, menus de seleção e modais com rotas próprias.',
    tag: 'RESPONDERS',
  },
  {
    number: '04',
    icon: '▤',
    title: 'Interfaces com Components V2',
    description:
      'Monte mensagens interativas usando uma API declarativa para textos, botões, seções e mais.',
    tag: 'UI',
  },
];

function FeaturesSection() {
  return (
    <section className={styles.featuresSection}>
      <div className="container">
        <div className={styles.sectionHeading}>
          <span className={styles.sectionEyebrow}>O QUE VOCÊ PODE CRIAR</span>
          <Heading as="h2">
            Tudo conectado.
            <br />
            <span>Sem perder o controle.</span>
          </Heading>
          <p>
            As ferramentas essenciais para construir e evoluir seu bot
            em uma estrutura consistente.
          </p>
        </div>

        <div className={styles.featureGrid}>
          {features.map((feature) => (
            <article className={styles.featureCard} key={feature.number}>
              <div className={styles.featureCardTop}>
                <span className={styles.featureIcon}>{feature.icon}</span>
                <span className={styles.featureNumber}>{feature.number}</span>
              </div>

              <span className={styles.featureTag}>{feature.tag}</span>
              <Heading as="h3">{feature.title}</Heading>
              <p>{feature.description}</p>
              <div className={styles.cardAccent} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuickStart() {
  return (
    <section className={styles.quickStart}>
      <div className="container">
        <div className={styles.quickStartCard}>
          <div>
            <span className={styles.sectionEyebrow}>SEU PRÓXIMO PROJETO</span>
            <Heading as="h2">Vamos tirar sua ideia do papel?</Heading>
            <p>
              Configure o ambiente, crie seu primeiro comando e comece
              a desenvolver com o Nexocord.
            </p>
          </div>

          <Link
            className={clsx('button button--lg', styles.primaryButton)}
            to="/docs/introduction">
            Explorar a documentação <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={siteConfig.title}
      description="Documentação do Nexocord: desenvolva bots para Discord com JavaScript ou TypeScript, Node.js ou Bun.">
      <main>
        <HomepageHeader />
        <FeaturesSection />
        <QuickStart />
      </main>
    </Layout>
  );
}
