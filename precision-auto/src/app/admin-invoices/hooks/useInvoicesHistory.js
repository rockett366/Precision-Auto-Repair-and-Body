"use client";
import { useEffect, useRef, useState } from "react";

// Normalize FastAPI List[InvoiceOut] -> { id, name, description, date }[]
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

export default function useInvoicesHistory(search = "") {
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const refreshId = useRef(0);           // simple refetch trigger

  const refetch = () => {
    refreshId.current++;
    setLoading(true);
  };

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        setError(null);
        const url = search
          ? `/api/invoices/history?name=${encodeURIComponent(search)}`
          : `/api/invoices/history`;
        const res = await fetch(url, {
          credentials: "include",
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
  }, [refreshId.current, search]);

  return { invoices, isLoading, isError: !!error, error, refetch };
}