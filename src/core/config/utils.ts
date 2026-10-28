export function format_message(message: string, count: number): string {
  return message.replaceAll("{count}", String(count));
}
