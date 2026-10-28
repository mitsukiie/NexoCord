
import fs from "node:fs";

import type {
  ProjectChoices,
  ProjectPackageJson,
} from "./types";

export function create_package_json(
  options: ProjectChoices,
): ProjectPackageJson {
  const is_ts = options.language === "typescript";
  const extension = is_ts ? "ts" : "js";

  const package_json: ProjectPackageJson = {
    name: options.name,
    version: "1.0.0",
    private: true,
    type: is_ts ? "module" : "commonjs",
    scripts: {
      dev: `nexo dev src/index.${extension}`,
      build: "nexo build",
      start: is_ts ? "nexo start dist/index.js" : `nexo start src/index.${extension}`,
    },
    dependencies: {
      nexocord: "latest",
      "discord.js": "^14.25.1",
    },
  };

  if (is_ts) {
    package_json.devDependencies = {
      typescript: "^7.0.2",
      ...(options.runtime === "bun"
        ? { "@types/bun": "latest" }
        : {
            "@types/node": "^24.0.0",
            tsx: "^4.20.0",
          }),
    };

    if (options.runtime === "node") {
      package_json.engines = { node: ">=20" };
    }
  }

  return package_json;
}

export function create_ts_config(
  options: ProjectChoices,
): Record<string, unknown> {
  return {
    compilerOptions: {
      target: "ESNext",
      module: "ESNext",
      moduleResolution: "Bundler",
      strict: true,
      skipLibCheck: true,
      outDir: "dist",
      rootDir: "src",
      resolveJsonModule: true,
      forceConsistentCasingInFileNames: true,
      types: options.runtime === "bun" ? ["bun"] : ["node"],
    },
    include: ["src"],
  };
}

export function write_json_file<T>(
  file_path: string,
  data: T,
): void {
  fs.writeFileSync(
    file_path,
    `${JSON.stringify(data, null, 2)}\n`,
    "utf8",
  );
}

export function configure_package_json(
  package_json: ProjectPackageJson,
  options: ProjectChoices,
  update_type: boolean,
): void {
  package_json.dependencies ??= {};
  package_json.scripts ??= {};

  package_json.dependencies.nexocord ??= "latest";
  package_json.dependencies["discord.js"] ??= "^14.25.1";

  if (options.language === "typescript") {
    package_json.devDependencies ??= {};
    package_json.devDependencies.typescript = "^7.0.2";

    if (options.runtime === "bun") {
      package_json.devDependencies["@types/bun"] ??= "latest";
    } else {
      package_json.devDependencies.tsx ??= "^4.20.0";
      package_json.devDependencies["@types/node"] ??= "^24.0.0";
    }

    if (options.runtime === "node") {
      package_json.engines ??= { node: ">=20" };
    }
  }

  if (update_type) {
    package_json.type =
      options.language === "typescript" ? "module" : "commonjs";
  }

  package_json.scripts.build ??= "nexo build";
  package_json.scripts.start ??=
    options.language === "typescript"
      ? "nexo start dist/index.js"
      : "nexo start src/index.js";

  package_json.scripts.dev ??=
    options.language === "typescript"
      ? "nexo dev src/index.ts"
      : "nexo dev src/index.js";
}
