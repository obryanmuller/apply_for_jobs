"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { pwdApi } from "@/lib/api/pwd";
import { PasswordRevealCard } from "@/components/password/PasswordRevealCard";

export default function Page() {
  const { pwdId } = useParams<{ pwdId: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    pwd: string;
    expiration_date: number;
    view_count: number;
    pass_view_limit?: number;
  } | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const resp = await pwdApi.get(String(pwdId));
        if (!alive) return;

        setData(resp);
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message ?? "Senha indisponível/expirada.");
        setData(null);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [pwdId]);

  const handleClose = () => router.push("/visualizar");

  return (
    <main style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#757575" }}>
      <PasswordRevealCard loading={loading} error={error} data={data} onClose={handleClose} />
    </main>
  );
}