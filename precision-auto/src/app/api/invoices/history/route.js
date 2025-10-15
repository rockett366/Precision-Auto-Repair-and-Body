import { NextResponse } from "next/server";

const INTERNAL = process.env.INTERNAL_API_BASE_URL || "http://api:8000";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");

  const upstream = `${INTERNAL}/api/invoices/history${name ? `?name=${encodeURIComponent(name)}` : ""}`;

  const res = await fetch(upstream, { cache: "no-store" });
  if (!res.ok) {
    return NextResponse.json({ error: `Upstream ${res.status}` }, { status: 502 });
  }
  return NextResponse.json(await res.json());
}