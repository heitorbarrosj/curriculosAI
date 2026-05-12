"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";

export function useDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/dashboard").then((response) => setData(response.data)).finally(() => setLoading(false));
  }, []);

  return { data, loading };
}
