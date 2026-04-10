"use client";

import React from "react";
import { NSIcon, NSTypography } from "@newtonschool/grauity";
import Card from "../components/VisualiserCard";
import visualizersData from "../data/visualisers.json";
import styles from "./page.module.css";

const HOME_LIMIT = 6;

export default function HomePage() {
  const featured = visualizersData.slice(0, HOME_LIMIT);
  const hasMore = visualizersData.length > HOME_LIMIT;

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <section className={styles.visualizersSection} id="explore">
          <div className={styles.sectionHeader}>
            <NSTypography
              variant="heading-sb-h3"
              as="h2"
              className={styles.sectionTitle}
            >
              Visualizers
            </NSTypography>
            <NSTypography
              variant="paragraph-md-p2"
              as="p"
              className={styles.sectionSummary}
            >
              {hasMore
                ? `Showing ${featured.length} of ${visualizersData.length} visualizers.`
                : `Browse ${visualizersData.length} available ${visualizersData.length === 1 ? "visualizer" : "visualizers"}.`}
            </NSTypography>
          </div>

          {featured.length > 0 ? (
            <div className={styles.visualizerGrid}>
              {featured.map((visualizer) => (
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
          ) : (
            <div className={styles.emptyState}>
              <NSTypography
                variant="heading-sb-h5"
                as="h3"
                className={styles.emptyStateTitle}
              >
                No visualizers yet
              </NSTypography>
              <NSTypography
                variant="paragraph-md-p2"
                as="p"
                className={styles.emptyStateDescription}
              >
                Visualizers will appear here as they are created.
              </NSTypography>
            </div>
          )}

          {hasMore && (
            <div className={styles.searchCta}>
              <NSIcon name="search" size="20" />
              <NSTypography variant="paragraph-sb-p2" as="p">
                Use the search in the header to find all {visualizersData.length} visualizers.
              </NSTypography>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
