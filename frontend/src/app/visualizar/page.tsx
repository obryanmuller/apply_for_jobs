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

  // Trava para impedir a execução dupla do useEffect
  const fetchStarted = useRef(false);

  useEffect(() => {
    if (fetchStarted.current) return;
    fetchStarted.current = true;
    
    let alive = true;

    const loadSecret = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Chamada única ao backend
        const resp = await pwdApi.get(String(pwdId));
        
        if (alive) {
          setData(resp);
          setLoading(false); // Finaliza o loading logo após receber o dado
        }
      } catch (e: any) {
        if (alive) {
          setError(e.message);
          setLoading(false); // Finaliza o loading em caso de erro
        }
      }
    };

    loadSecret();

    return () => {
      alive = false;
    };
  }, [pwdId]);

  // Volta para a home no modo consulta
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