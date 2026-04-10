"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NSButton, NSIcon, NSTypography } from "@newtonschool/grauity";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { fuzzyFilter, type SearchResult } from "../../lib/fuzzy-search";
import visualizersData from "../../data/visualisers.json";
import styles from "./Header.module.css";

export default function Header() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  const updateResults = useCallback((query: string) => {
    const matched = fuzzyFilter(query, visualizersData);
    setResults(matched);
    setActiveIndex(-1);
  }, []);

  useEffect(() => {
    if (isSearchOpen) {
      inputRef.current?.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (!isSearchOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSearchOpen]);

  function handleClose() {
    setIsSearchOpen(false);
    setSearchValue("");
    setResults([]);
    setActiveIndex(-1);
  }

  function handleChange(value: string) {
    setSearchValue(value);
    updateResults(value);
  }

  function navigateToResult(result: SearchResult) {
    handleClose();
    router.push(result.href);
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Escape") {
      handleClose();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      if (activeIndex >= 0 && results[activeIndex]) {
        navigateToResult(results[activeIndex]);
      }
    }
  }

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <Link href="/" className={styles.logoLink}>
          <div className={styles.logoIcon} />
          <span className={styles.logoText}>Playbox</span>
        </Link>
        <nav className={styles.nav}>
          {isSearchOpen ? (
            <div className={styles.searchWrapper}>
              <div className={styles.searchField}>
                <NSIcon name="search" size="16" />
                <input
                  ref={inputRef}
                  aria-label="Search visualizers"
                  className={styles.searchInput}
                  onChange={(event) => handleChange(event.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search visualizers..."
                  type="text"
                  value={searchValue}
                  role="combobox"
                  aria-expanded={results.length > 0}
                  aria-activedescendant={
                    activeIndex >= 0 ? `search-result-${activeIndex}` : undefined
                  }
                />
              </div>

              {searchValue.trim() && (
                <div
                  ref={dropdownRef}
                  className={styles.searchDropdown}
                  role="listbox"
                >
                  {results.length > 0 ? (
                    results.map((result, index) => (
                      <button
                        key={result.href}
                        id={`search-result-${index}`}
                        role="option"
                        aria-selected={index === activeIndex}
                        className={`${styles.searchResultItem} ${
                          index === activeIndex ? styles.searchResultActive : ""
                        }`}
                        onClick={() => navigateToResult(result)}
                        type="button"
                      >
                        <div
                          className={`${styles.searchResultIcon} ${
                            styles[result.iconColor] || ""
                          }`}
                        />
                        <div className={styles.searchResultText}>
                          <NSTypography variant="action-sb-p2" as="span">
                            {result.title}
                          </NSTypography>
                          <NSTypography
                            variant="paragraph-md-p2"
                            as="span"
                            color="secondary"
                          >
                            {result.description}
                          </NSTypography>
                        </div>
                        <NSIcon name="arrow-right" size="14" />
                      </button>
                    ))
                  ) : (
                    <div className={styles.searchNoResults}>
                      <NSTypography variant="paragraph-md-p2" color="secondary">
                        No visualizers found for &ldquo;{searchValue}&rdquo;
                      </NSTypography>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <NSButton
              color="neutral"
              icon="search"
              onClick={() => setIsSearchOpen(true)}
              size="small"
              variant="secondary"
            >
              Search
            </NSButton>
          )}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
