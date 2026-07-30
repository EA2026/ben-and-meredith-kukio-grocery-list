import { NextResponse } from "next/server";
import { getRequests, addRequest, VisitRequest } from "@/lib/kv";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const requests = await getRequests();
    return NextResponse.json({ requests });
  } catch (err) {
    console.error("GET /api/requests failed", err);
    return NextResponse.json({ error: "Could not load past visit requests." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: VisitRequest = await request.json();
    if (!body.visitDate || !Array.isArray(body.items)) {
      return NextResponse.json({ error: "Malformed request payload." }, { status: 400 });
    }
    const requests = await addRequest(body);
    return NextResponse.json({ requests });
  } catch (err) {
    console.error("POST /api/requests failed", err);
    return NextResponse.json({ error: "Could not save this request." }, { status: 500 });
  }
}
