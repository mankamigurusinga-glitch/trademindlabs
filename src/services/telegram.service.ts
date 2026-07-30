/**
 * Telegram bot placeholder.
 *
 * Real delivery will run server-side (bot token must never reach the browser).
 * These helpers exist so notification settings can be wired today.
 */
export interface TelegramMessage {
  telegramUsername: string;
  title: string;
  body: string;
}

export const telegramService = {
  async sendAlert(message: TelegramMessage): Promise<{ ok: boolean; delivered: boolean }> {
    console.info("[telegram] delivery not configured yet", message);
    return { ok: true, delivered: false };
  },
  async verifyUsername(username: string): Promise<boolean> {
    return /^@?[A-Za-z0-9_]{5,32}$/.test(username);
  },
};
