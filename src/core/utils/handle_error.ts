import { logger } from "./logger";

export function handle_error(
  error: unknown,
  fallback = "Ocorreu um erro inesperado.",
): void {
  const message = error instanceof Error ? error.message : fallback;

  logger.error(`\n✗ ${message}\n`);
  process.exitCode = 1;
}
