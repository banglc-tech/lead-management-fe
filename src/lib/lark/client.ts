import "server-only";
import type { LarkFields } from "./field-map";

/**
 * Client tối giản cho Lark Open API (Bitable v1), chỉ chạy phía server.
 * Docs: https://open.larksuite.com/document/server-docs/docs/bitable-v1/app-table-record/list
 */

const DOMAIN = process.env.LARK_DOMAIN ?? "https://open.larksuite.com";

let cachedToken: { value: string; expiresAt: number } | null = null;

async function getTenantToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value;

  const res = await fetch(`${DOMAIN}/open-apis/auth/v3/tenant_access_token/internal`, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      app_id: process.env.LARK_APP_ID,
      app_secret: process.env.LARK_APP_SECRET,
    }),
    cache: "no-store",
  });
  const json = (await res.json()) as { code: number; msg: string; tenant_access_token: string; expire: number };
  if (json.code !== 0) throw new LarkError(json.code, `Lấy tenant_access_token lỗi: ${json.msg}`);

  cachedToken = { value: json.tenant_access_token, expiresAt: Date.now() + json.expire * 1000 };
  return cachedToken.value;
}

export class LarkError extends Error {
  constructor(public code: number, message: string) {
    super(message);
  }
}

async function larkFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = await getTenantToken();
  const res = await fetch(`${DOMAIN}/open-apis${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json; charset=utf-8",
      ...init.headers,
    },
    cache: "no-store",
  });
  const json = (await res.json()) as { code: number; msg: string; data: T };
  if (json.code !== 0) throw new LarkError(json.code, `Lark API ${path}: ${json.msg}`);
  return json.data;
}

const base = () =>
  `/bitable/v1/apps/${process.env.LARK_BASE_APP_TOKEN}/tables/${process.env.LARK_LEADS_TABLE_ID}/records`;

export interface LarkRecord {
  record_id: string;
  fields: LarkFields;
}

export async function listRecords(): Promise<LarkRecord[]> {
  const items: LarkRecord[] = [];
  let pageToken: string | undefined;
  do {
    const qs = new URLSearchParams({ page_size: "500" });
    if (pageToken) qs.set("page_token", pageToken);
    const data = await larkFetch<{ items?: LarkRecord[]; has_more: boolean; page_token?: string }>(
      `${base()}?${qs}`,
    );
    items.push(...(data.items ?? []));
    pageToken = data.has_more ? data.page_token : undefined;
  } while (pageToken);
  return items;
}

export async function getRecord(id: string): Promise<LarkRecord> {
  const data = await larkFetch<{ record: LarkRecord }>(`${base()}/${id}`);
  return data.record;
}

export async function createRecord(fields: LarkFields): Promise<LarkRecord> {
  const data = await larkFetch<{ record: LarkRecord }>(base(), {
    method: "POST",
    body: JSON.stringify({ fields }),
  });
  return data.record;
}

export async function updateRecord(id: string, fields: LarkFields): Promise<LarkRecord> {
  const data = await larkFetch<{ record: LarkRecord }>(`${base()}/${id}`, {
    method: "PUT",
    body: JSON.stringify({ fields }),
  });
  return data.record;
}
