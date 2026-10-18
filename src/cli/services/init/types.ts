import type { ProjectLanguage, ProjectRuntime } from "../create/prompts";

export interface InitOptions {
  runtime?: string;
  language?: string;
}

export interface InitPackageJson {
  name?: string;
  type?: string;
  packageManager?: string;
  nexocord?: unknown;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

export interface DetectedProject {
  runtime: ProjectRuntime;
  language: ProjectLanguage;
  has_nexo_configuration: boolean;
}
