export class CooldownManager {
  private cooldowns = new Map<string, number>();

  isOnCooldown(id: string, command: string): boolean {
    return Date.now() < (this.cooldowns.get(`${id}-${command}`) ?? 0);
  }

  set(id: string, command: string, duration: number) {
    const key = `${id}-${command}`;
    this.cooldowns.set(key, Date.now() + duration * 1000);
  }

  get(id: string, command: string): number {
    const expire = this.cooldowns.get(`${id}-${command}`) ?? 0;
    return Math.max(0, expire - Date.now());
  }
}
