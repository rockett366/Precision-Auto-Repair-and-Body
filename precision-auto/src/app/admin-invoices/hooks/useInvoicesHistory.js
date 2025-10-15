"use client";
import { useEffect, useRef, useState } from "react";

// Normalize FastAPI -> { id, name, description, date }[]
function normalizeInvoices(arr) {
  if (!Array.isArray(arr)) return [];
  return arr
    .map((e) => ({
      id: e?.id ?? null,
      name: e?.name ?? "",
      description: e?.description ?? "",
      date: typeof e?.date === "string" ? e.date : null,
    }))
    .filter((e) => e.id !== null && !!e.date);
}

/**
 * Backend-driven fetch with search + sort.
 * @param {string} search - search string (name)
 * @param {string} sortKey - "name" | "date" | "description" | ""
 * @param {string} sortOrder - "asc" | "desc"
 */
export default function useInvoicesHistory(search = "", sortKey = "", sortOrder = "asc") {
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // little refetch toggle
  const refreshId = useRef(0);
  const refetch = () => {
    refreshId.current++;
    setLoading(true);
  };

  useEffect(() => {
    const controller = new AbortController();

    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (sortKey) params.set("sort", sortKey);
    if (sortOrder) params.set("order", sortOrder);

    (async () => {
      try {
        setError(null);
        const res = await fetch(`/api/invoices/history?${params.toString()}`, {
          credentials: "include",
          cache: "no-store",
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Fetch failed ${res.status}`);
        const json = await res.json();
        setInvoices(normalizeInvoices(json));
      } catch (err) {
        if (err.name !== "AbortError") setError(err);
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [search, sortKey, sortOrder, refreshId.current]);

  return { invoices, isLoading, isError: !!error, error, refetch };
}