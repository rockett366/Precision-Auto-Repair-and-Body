import { NextResponse } from "next/server";

const INTERNAL = process.env.INTERNAL_API_BASE_URL || "http://api:8000";

// forward q, sort, order to the backend
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const sort = searchParams.get("sort") || "";
  const order = searchParams.get("order") || "";

  const upstream = new URL(`${INTERNAL}/api/invoices/history`);
  if (q) upstream.searchParams.set("q", q);
  if (sort) upstream.searchParams.set("sort", sort);
  if (order) upstream.searchParams.set("order", order);

  const res = await fetch(upstream.toString(), { cache: "no-store" });
  if (!res.ok) {
    return NextResponse.json({ error: `Upstream ${res.status}` }, { status: 502 });
  }
  return NextResponse.json(await res.json());
}