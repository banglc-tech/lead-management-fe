export const LEAD_STATUSES = [
  "Mới",
  "Đang liên hệ",
  "Quan tâm",
  "Hẹn xem",
  "Đã chốt",
  "Thất bại",
] as const;

export const LEAD_SOURCES = [
  "Facebook",
  "Zalo",
  "Website",
  "Hotline",
  "Giới thiệu",
  "Khác",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];
export type LeadSource = (typeof LEAD_SOURCES)[number];

export interface Lead {
  id: string; // record_id trên Lark Base
  name: string;
  phone: string;
  email?: string;
  source?: LeadSource;
  project?: string;
  status: LeadStatus;
  assignee?: string;
  budget?: number;
  note?: string;
  createdAt?: number; // epoch ms
}

export type LeadInput = Omit<Lead, "id">;

export interface LeadQuery {
  q?: string;
  status?: LeadStatus;
  source?: LeadSource;
}
