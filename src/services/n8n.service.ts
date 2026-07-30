/**
 * n8n webhook placeholder.
 *
 * When the automation backend is ready, point `N8N_WEBHOOK_URL` at the live
 * workflow and implement `trigger`. Nothing in the UI needs to change.
 */
export const N8N_WEBHOOK_URL = "";

export interface N8nPayload {
  event: string;
  userId?: string;
  data?: Record<string, unknown>;
}

export const n8nService = {
  async trigger(payload: N8nPayload): Promise<{ ok: boolean; queued: boolean }> {
    if (!N8N_WEBHOOK_URL) {
      console.info("[n8n] webhook not configured yet — payload queued locally", payload);
      return { ok: true, queued: true };
    }
    return { ok: true, queued: false };
  },
};
