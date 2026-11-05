import { NextResponse, type NextRequest } from "next/server";
import { createLead, listLeads } from "@/lib/leads/repository";
import type { LeadInput, LeadQuery } from "@/lib/leads/types";
import { parseLeadInput } from "@/lib/leads/validate";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const query: LeadQuery = {
    q: sp.get("q") ?? undefined,
    status: (sp.get("status") as LeadQuery["status"]) ?? undefined,
    source: (sp.get("source") as LeadQuery["source"]) ?? undefined,
  };
  return NextResponse.json({ data: await listLeads(query) });
}

export async function POST(req: NextRequest) {
  const { data, error } = parseLeadInput(await req.json().catch(() => null));
  if (error) return NextResponse.json({ error }, { status: 400 });
  return NextResponse.json({ data: await createLead(data as LeadInput) }, { status: 201 });
}
