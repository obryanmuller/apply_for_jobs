import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 60px",
        backgroundColor: "#011F2B",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        {/* Logo Direta sem círculo */}
        <Image
          src="/icontotvs.png" 
          alt="TOTVS"
          width={60} 
          height={50}
          style={{ objectFit: "contain" }}
        />
        <h1 style={{ color: "white", fontSize: "28px", fontWeight: "bold", margin: 0 }}>
          Desafio técnico Totvs
        </h1>
      </div>

      <nav style={{ display: "flex", gap: "40px" }}>
        <Link href="/" style={{ color: "white", textDecoration: "none", fontSize: "24px", fontWeight: "bold" }}>
          Gerar
        </Link>
        <Link href="/visualizar" style={{ color: "white", textDecoration: "none", fontSize: "24px", fontWeight: "bold", opacity: 0.7 }}>
          Visualizar
        </Link>
      </nav>
    </header>
  );
}