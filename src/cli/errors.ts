export class NexoError extends Error {
  public readonly code: string;
  public readonly exit_code: number;

  constructor(message: string, code = "NEXO_ERROR", exit_code = 1) {
    super(message);

    this.name = "NexoError";
    this.code = code;
    this.exit_code = exit_code;
  }
}

export function get_error_message(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "Ocorreu um erro inesperado.";
}
