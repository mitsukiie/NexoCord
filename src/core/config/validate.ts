import { z } from "zod";

const config_overrides_schema = z
  .object({
    directories: z
      .object({
        commands: z.string().min(1).optional(),
        events: z.string().min(1).optional(),
      })
      .strict()
      .optional(),

    terminal: z
      .object({
        mode: z.enum(["informativo", "minimalista"]).optional(),

        commands: z
          .object({
            showFiles: z.boolean().optional(),
            showRegistered: z.boolean().optional(),
            registeredMessage: z.string().optional(),
          })
          .strict()
          .optional(),

        events: z
          .object({
            showFiles: z.boolean().optional(),
            showRegistered: z.boolean().optional(),
            registeredMessage: z.string().optional(),
          })
          .strict()
          .optional(),
      })
      .strict()
      .optional(),

    bot: z
      .object({
        cooldown: z.number().finite().nonnegative().optional(),

        guildID: z.array(z.string().min(1)).optional(),

        errors: z
          .object({
            interaction: z.string().min(1).optional(),
          })
          .strict()
          .optional(),
      })
      .strict()
      .optional(),
  })
  .strict();

export type ConfigOverrides = z.infer<typeof config_overrides_schema>;

export function validate_config_overrides(input: unknown): ConfigOverrides {
  const result = config_overrides_schema.safeParse(input);

  if (!result.success) {
    const details = result.error.issues
      .map((issue) => {
        const field = issue.path.join(".") || "(raiz)";
        return `  - ${field}: ${issue.message}`;
      })
      .join("\n");

    throw new Error(`Configuração do NexoCord inválida:\n${details}`);
  }

  return result.data;
}
