
import { generate_project } from "./generator";
import { install_dependencies } from "./install";

import type {
  ProjectChoices,
  GenerateProjectOptions,
} from "./types";

export interface SetupProjectOptions {
  target_dir: string;
  choices: ProjectChoices;
  generate?: GenerateProjectOptions;
}

export async function setup_project(
  options: SetupProjectOptions,
): Promise<void> {
  await generate_project(
    options.choices,
    options.target_dir,
    options.generate,
  );

  await install_dependencies(
    options.target_dir,
    options.choices.runtime,
  );
}
