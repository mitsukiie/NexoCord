
import type {
  ProjectLanguage,
  ProjectRuntime,
  ProjectPackageJson,
} from "../project/types";

export interface InitOptions {
  runtime?: string;
  language?: string;
}

export type InitPackageJson = ProjectPackageJson;

export interface DetectedProject {
  runtime: ProjectRuntime;
  language: ProjectLanguage;
  has_nexo_configuration: boolean;
}
