import { NextResponse } from "next/server";
import { getRequests, addRequest, deleteRequest, VisitRequest } from "@/lib/kv";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const requests = await getRequests();
    return NextResponse.json({ requests });
  } catch (err) {
    console.error("GET /api/requests failed", err);
    const message = err instanceof Error ? err.message : "Could not load past visit requests.";
    return NextResponse.json({ error: message }, { status: 500 });
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
    const message = err instanceof Error ? err.message : "Could not save this request.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing id to delete." }, { status: 400 });
    }
    const requests = await deleteRequest(id);
    return NextResponse.json({ requests });
  } catch (err) {
    console.error("DELETE /api/requests failed", err);
    const message = err instanceof Error ? err.message : "Could not delete this visit.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
