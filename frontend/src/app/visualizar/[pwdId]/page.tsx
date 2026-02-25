"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { pwdApi } from "@/lib/api/pwd";
import { PasswordRevealCard } from "@/components/password/PasswordRevealCard";

export default function Page() {
  const { pwdId } = useParams<{ pwdId: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  // useRef para garantir que a API seja chamada apenas UMA vez com sucesso
  const fetchLock = useRef(false);

  useEffect(() => {
    // Se já temos dados ou erro, não precisamos buscar de novo
    if (data || error || fetchLock.current) return;

    let isMounted = true;
    fetchLock.current = true;

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
      // Se desmontar sem ter completado (comum no Strict Mode), 
      // liberamos a trava para a segunda montagem tentar buscar
      if (!data && !error) {
        fetchLock.current = false;
      }
    };
  }, [pwdId, data, error]);

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