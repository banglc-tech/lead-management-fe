import { NextResponse, type NextRequest } from "next/server";
import { getLead, updateLead } from "@/lib/leads/repository";
import { parseLeadInput } from "@/lib/leads/validate";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const lead = await getLead((await params).id);
  if (!lead) return NextResponse.json({ error: "Không tìm thấy lead" }, { status: 404 });
  return NextResponse.json({ data: lead });
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const { data, error } = parseLeadInput(await req.json().catch(() => null), true);
  if (error) return NextResponse.json({ error }, { status: 400 });
  const lead = await updateLead((await params).id, data!);
  if (!lead) return NextResponse.json({ error: "Không tìm thấy lead" }, { status: 404 });
  return NextResponse.json({ data: lead });
}
