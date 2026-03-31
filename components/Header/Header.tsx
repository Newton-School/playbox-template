"use client";
import React from "react";
import Link from "next/link";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <Link href="/" className={styles.logoLink}>
          <div className={styles.logoIcon} />
          <span className={styles.logoText}>Playbox</span>
        </Link>
        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>Home</Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
