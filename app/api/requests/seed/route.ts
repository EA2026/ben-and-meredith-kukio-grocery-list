import { NextResponse } from "next/server";
import { seedHistoricalRequestsIfEmpty } from "@/lib/kv";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const requests = await seedHistoricalRequestsIfEmpty();
    return NextResponse.json({ requests });
  } catch (err) {
    console.error("POST /api/requests/seed failed", err);
    return NextResponse.json({ error: "Could not seed historical visits." }, { status: 500 });
  }
}
