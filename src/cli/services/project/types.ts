
export type ProjectRuntime = "node" | "bun";

export type ProjectLanguage = "typescript" | "javascript";

export interface ProjectChoices {
  name: string;
  runtime: ProjectRuntime;
  language: ProjectLanguage;
}

export interface ProjectPackageJson {
  name?: string;
  version?: string;
  private?: boolean;
  type?: string;
  packageManager?: string;
  engines?: Record<string, string>;
  nexocord?: unknown;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

export interface GenerateProjectOptions {
  create_package_json?: boolean;
  overwrite_files?: boolean;
}

export interface GenerateResult {
  target_dir: string;
  project_name: string;
  runtime: ProjectRuntime;
  language: ProjectLanguage;
}
