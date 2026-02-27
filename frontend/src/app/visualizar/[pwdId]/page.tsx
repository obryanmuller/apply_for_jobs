"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { pwdApi } from "@/lib/api/pwd";
import { PasswordRevealCard } from "@/components/password/PasswordRevealCard";

export default function Page() {
  const { pwdId } = useParams<{ pwdId: string }>();
  const router = useRouter();
  const fetchedRef = useRef(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!pwdId || fetchedRef.current) return;

    const loadSecret = async () => {
      fetchedRef.current = true;

      try {
        setLoading(true);
        const resp = await pwdApi.get(String(pwdId));
        setData(resp);
        setError(null);
      } catch (e: any) {
        setError(e.message || "Erro ao carregar segredo");
        setData(null);
        fetchedRef.current = false;
      } finally {
        setLoading(false);
      }
    };

    loadSecret();

    return () => {
      fetchedRef.current = false;
    };
  }, [pwdId]);

  const handleClose = () => router.push("/?mode=view");

  return (
    <main style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "#f1f5f9"
    }}>
      <PasswordRevealCard
        loading={loading}
        error={error}
        data={data}
        onClose={handleClose}
      />
    </main>
  );
}