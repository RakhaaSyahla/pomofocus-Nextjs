// app/components/Header.tsx

import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          {/* Kamu bisa ganti ini dengan logo/icon nanti */}
          Pomofocus
        </Link>
        <nav>
          {/* Ini adalah contoh link navigasi */}
          <Link href="#" className={styles.navLink}>
            Report
          </Link>
          <Link href="#" className={styles.navLink}>
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}