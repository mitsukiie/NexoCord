import fs from "fs";
import path from "path";

import { NexoError } from "../../errors";
import { log } from "../../logger";
import { get_package_manager, run_command } from "../../utils";

export async function run_build(): Promise<void> {
  const config = path.resolve(process.cwd(), "tsconfig.json");

  if (!fs.existsSync(config)) {
    log.info("Projeto JavaScript: nenhuma compilação é necessária.");
    return;
  }

  const command = get_package_manager() === "bun" ? "bunx" : "npx";

  log.start();
  log.info("🔨 Compilando projeto...");

  const code = await run_command(command, ["--no-install", "tsc", "-p", config]);

  if (code !== 0) {
    throw new NexoError(
      `A compilação terminou com código ${code}.`,
      "BUILD_FAILED",
      code,
    );
  }

  ensure_esm_output_metadata(config);
  log.success("Projeto compilado em dist.");
}

function ensure_esm_output_metadata(config_path: string): void {
  const package_json = JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), "package.json"), "utf8"),
  ) as { type?: string };
  const tsconfig = JSON.parse(fs.readFileSync(config_path, "utf8")) as {
    compilerOptions?: { module?: string; outDir?: string };
  };
  const module_format = tsconfig.compilerOptions?.module?.toLowerCase();
  const output_dir = path.resolve(
    process.cwd(),
    tsconfig.compilerOptions?.outDir ?? "dist",
  );

  if (
    package_json.type !== "module" &&
    module_format &&
    ["es6", "es2015", "es2020", "es2022", "esnext"].includes(module_format)
  ) {
    fs.mkdirSync(output_dir, { recursive: true });
    fs.writeFileSync(
      path.join(output_dir, "package.json"),
      '{\n  "type": "module"\n}\n',
      "utf8",
    );
  }
}
