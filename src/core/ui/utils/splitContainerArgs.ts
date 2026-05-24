import type { ContainerInput, ContainerOptions } from '../types';

function isContainerOptions(value: unknown): value is ContainerOptions {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  return 'color' in (value as Record<string, unknown>);
}

/**
 * Splits the overloaded container inputs into options and components.
 *
 * @param args Container arguments.
 * @returns Normalized container options and component list.
 */
export function splitContainerArgs(
  args: [ContainerOptions, ...ContainerInput[]] | ContainerInput[],
) {
  if (isContainerOptions(args[0])) {
    return {
      options: args[0],
      components: args.slice(1) as ContainerInput[],
    };
  }

  return {
    options: {} as ContainerOptions,
    components: args as ContainerInput[],
  };
}
