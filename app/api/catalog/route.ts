import { NextResponse } from "next/server";
import { getCatalog, saveCatalog } from "@/lib/kv";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const catalog = await getCatalog();
    return NextResponse.json({ catalog });
  } catch (err) {
    console.error("GET /api/catalog failed", err);
    return NextResponse.json({ error: "Could not load the shared catalog." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!Array.isArray(body.catalog)) {
      return NextResponse.json({ error: "Malformed catalog payload." }, { status: 400 });
    }
    await saveCatalog(body.catalog);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("POST /api/catalog failed", err);
    return NextResponse.json({ error: "Could not save the shared catalog." }, { status: 500 });
  }
}
