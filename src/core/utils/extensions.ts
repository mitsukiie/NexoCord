import path from 'path';

export const extensions: ReadonlyArray<`.${string}`> = ['.ts', '.js', '.mjs', '.cjs'];

const extensionSet = new Set<string>(extensions);
export const GLOB = `**/*.{${extensions.map((ext) => ext.slice(1)).join(',')}}`;

export function isScript(file: string): boolean {
  return extensionSet.has(path.extname(file));
}