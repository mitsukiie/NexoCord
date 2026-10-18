import path from "path";

export const extensions: ReadonlyArray<`.${string}`> = [
  ".ts",
  ".js",
  ".mjs",
  ".cjs",
];

const extension_set = new Set<string>(extensions);
export const GLOB = `**/*.{${extensions.map((ext) => ext.slice(1)).join(",")}}`;

export function is_script(file: string): boolean {
  return extension_set.has(path.extname(file));
}
