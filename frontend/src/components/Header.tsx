"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";

export function Header() {
  const pathname = usePathname();

  /**
   * Verifica se o link está ativo. 
   * Para "Visualizar", consideramos ativo se o caminho começar com /visualizar
   */
  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logoSection} style={{ textDecoration: 'none' }}>
        <Image
          src="/icontotvs.png"
          alt="TOTVS Logo"
          width={38}
          height={32}
          style={{ objectFit: "contain" }}
        />
        <h1 className={styles.title}>Desafio Técnico</h1>
      </Link>

      <nav className={styles.nav}>
        <Link 
          href="/" 
          className={`${styles.navLink} ${isActive("/") ? styles.activeLink : ""}`}
        >
          Gerar
        </Link>
        <Link 
          href="/visualizar" 
          className={`${styles.navLink} ${isActive("/visualizar") ? styles.activeLink : ""}`}
        >
          Visualizar
        </Link>
      </nav>
    </header>
  );
}