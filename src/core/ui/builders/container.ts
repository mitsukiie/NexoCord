import {
  ContainerBuilder,
} from 'discord.js';

import type {
  ContainerInput,
  ContainerOptions,
} from '../types';

import {
  collect_attachments,
  attach_attachments,
} from '../normalizers/media';

import {
  to_container_child,
} from '../normalizers/component';

import {
  validate,
} from '../validators';

/** Verifica se o argumento representa opções de container. */
function is_container_options(
  value: unknown,
): value is ContainerOptions {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    'color' in value
  );
}

/** Separa as opções dos componentes recebidos. */
function split_container_args(
  args: (ContainerOptions | ContainerInput)[],
): {
  options: ContainerOptions;
  components: ContainerInput[];
} {
  if (is_container_options(args[0])) {
    return {
      options: args[0],
      components: args.slice(1) as ContainerInput[],
    };
  }

  return {
    options: {},
    components: args as ContainerInput[],
  };
}

/**
 * Cria um container com os componentes informados.
 *
 * [pt-BR] Passe componentes declarativos da API `ui` e, opcionalmente, um
 * `ContainerOptions` como primeiro argumento.
 * [en] Pass declarative `ui` components and optionally a `ContainerOptions`
 * object as the first argument.
 *
 * @param args - [pt-BR] Opções e componentes do container.
 * [en] Container options and children.
 * @returns [pt-BR] Container pronto para uma resposta.
 * [en] Container ready for a response.
 */
export function container(
  ...args: [ContainerOptions, ...ContainerInput[]] | ContainerInput[]
): ContainerBuilder {
  const {
    options,
    components,
  } = split_container_args(args);

  const builder = new ContainerBuilder();

  builder.components.push(
    ...components.map(to_container_child),
  );

  if (options.color !== undefined) {
    builder.setAccentColor(
      validate.color(options.color),
    );
  }

  const attachments = components.flatMap((component) => {
    if (
      typeof component === 'object' &&
      component !== null &&
      'type' in component &&
      component.type === 'file' &&
      'attachment' in component &&
      component.attachment !== undefined
    ) {
      return [component.attachment];
    }

    return [];
  });

  return attach_attachments(
  builder,
  collect_attachments(builder.components),
);
}