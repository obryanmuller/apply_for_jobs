import Link from "next/link";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import styles from "@/app/styles/NotFound.module.css";

export default function NotFound() {
  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconCircle}>
          <HiOutlineExclamationCircle size={48} color="#0f172a" />
        </div>

        <h1 className={styles.title}>404</h1>
        <h2 className={styles.subtitle}>Página não encontrada</h2>

        <p className={styles.description}>
          O segredo que você procura não existe, expirou ou o endereço digitado está incorreto.
        </p>

        <Link href="/" className={styles.homeBtn}>
          Voltar para o Início
        </Link>
      </div>
    </main>
  );
}