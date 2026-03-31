"use client";
import React from "react";
import Link from "next/link";
import { NSIcon, NSTypography } from "@newtonschool/grauity";
import styles from "./index.module.css";

interface CardProps {
  title: string;
  description: string;
  href: string;
  iconColor: string;
  status: string;
}

export default function Card({
  title,
  description,
  href,
  iconColor,
  status = "available"
}: CardProps) {
  if (status === "coming-soon") {
    return (
      <div className={styles.comingSoon}>
        <NSTypography
          variant="heading-sb-h3"
          as="h3"
          className={styles.comingSoonTitle}
        >
          Coming soon
        </NSTypography>
        <NSTypography
          variant="paragraph-md-p2"
          as="p"
          className={styles.comingSoonDescription}
        >
          More algorithm visualizers will appear here.
        </NSTypography>
      </div>
    );
  }

  return (
    <Link href={href} className={styles.visualizerCard}>
      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <div className={styles.cardInfo}>
            <NSTypography
              variant="heading-sb-h3"
              as="h3"
              className={styles.cardTitle}
            >
              {title}
            </NSTypography>
            <NSTypography
              variant="paragraph-md-p2"
              as="p"
              className={styles.cardDescription}
            >
              {description}
            </NSTypography>
          </div>
          <div className={`${styles.cardIcon} ${styles[iconColor]}`} />
        </div>
        <div className={styles.cardFooter}>
          <span className={styles.cardAction}>
            Open visualizer
            <NSIcon name="arrow-right" />
          </span>
        </div>
      </div>
    </Link>
  );
}
