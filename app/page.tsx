"use client";

import React from "react";
import { NSTypography } from "@newtonschool/grauity";
import Card from "../components/VisualiserCard";
import visualizersData from "../data/visualisers.json";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <section className={styles.visualizersSection}>
          <div className={styles.sectionHeader}>
            <NSTypography
              variant="heading-sb-h3"
              as="h2"
              className={styles.sectionTitle}
            >
              Available visualizers
            </NSTypography>
          </div>
          <div className={styles.visualizerGrid}>
            {visualizersData.map((visualizer) => (
              <Card
                key={visualizer.href}
                title={visualizer.title}
                description={visualizer.description}
                href={visualizer.href}
                iconColor={visualizer.iconColor}
                status={visualizer.status}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
