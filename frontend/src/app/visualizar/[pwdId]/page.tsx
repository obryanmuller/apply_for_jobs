"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { pwdApi } from "@/lib/api/pwd";
import { PasswordRevealCard } from "@/components/password/PasswordRevealCard";

// Mapa global para evitar chamadas duplicadas da API em Strict Mode
const globalFetchLocks = new Map<string, boolean>();

export default function Page() {
  const { pwdId } = useParams<{ pwdId: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // Verifica se já estamos buscando este pwdId
    if (!pwdId || globalFetchLocks.get(pwdId)) return;

    globalFetchLocks.set(pwdId, true);

    let isMounted = true;

    const loadSecret = async () => {
      try {
        setLoading(true);
        const resp = await pwdApi.get(String(pwdId));
        
        if (isMounted) {
          setData(resp);
          setError(null);
        }
      } catch (e: any) {
        if (isMounted) {
          setError(e.message || "Erro ao carregar segredo");
          setData(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadSecret();

    return () => {
      isMounted = false;
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