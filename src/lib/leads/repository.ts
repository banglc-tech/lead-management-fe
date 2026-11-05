import "server-only";
import * as lark from "@/lib/lark/client";
import { fromLarkRecord, toLarkFields } from "@/lib/lark/field-map";
import { MOCK_LEADS } from "./mock-data";
import type { Lead, LeadInput, LeadQuery } from "./types";

/** Nguồn dữ liệu: Lark Base, hoặc dữ liệu mẫu nếu chưa cấu hình. */
export function isMockMode(): boolean {
  return (
    process.env.USE_MOCK_DATA === "true" ||
    !process.env.LARK_APP_ID ||
    !process.env.LARK_APP_SECRET
  );
}

const mockStore: Lead[] = structuredClone(MOCK_LEADS);

function applyQuery(leads: Lead[], query: LeadQuery): Lead[] {
  const q = query.q?.trim().toLowerCase();
  return leads
    .filter((l) => !query.status || l.status === query.status)
    .filter((l) => !query.source || l.source === query.source)
    .filter(
      (l) =>
        !q ||
        l.name.toLowerCase().includes(q) ||
        l.phone.includes(q) ||
        (l.email ?? "").toLowerCase().includes(q) ||
        (l.project ?? "").toLowerCase().includes(q),
    )
    .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
}

export async function listLeads(query: LeadQuery = {}): Promise<Lead[]> {
  if (isMockMode()) return applyQuery(mockStore, query);
  const records = await lark.listRecords();
  return applyQuery(
    records.map((r) => fromLarkRecord(r.record_id, r.fields)),
    query,
  );
}

export async function getLead(id: string): Promise<Lead | null> {
  if (isMockMode()) return mockStore.find((l) => l.id === id) ?? null;
  try {
    const r = await lark.getRecord(id);
    return fromLarkRecord(r.record_id, r.fields);
  } catch (e) {
    if (e instanceof lark.LarkError) return null;
    throw e;
  }
}

export async function createLead(input: LeadInput): Promise<Lead> {
  const data = { ...input, createdAt: input.createdAt ?? Date.now() };
  if (isMockMode()) {
    const lead = { ...data, id: `mock-${Date.now()}` };
    mockStore.unshift(lead);
    return lead;
  }
  const r = await lark.createRecord(toLarkFields(data));
  return fromLarkRecord(r.record_id, r.fields);
}

export async function updateLead(id: string, patch: Partial<LeadInput>): Promise<Lead | null> {
  if (isMockMode()) {
    const i = mockStore.findIndex((l) => l.id === id);
    if (i < 0) return null;
    mockStore[i] = { ...mockStore[i], ...patch };
    return mockStore[i];
  }
  const r = await lark.updateRecord(id, toLarkFields(patch));
  return fromLarkRecord(r.record_id, r.fields);
}
