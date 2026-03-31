"use client";
import React from "react";
import { GrauityThemeProvider } from "@newtonschool/grauity";
import { ThemeProvider } from "../components/ThemeProvider/ThemeProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GrauityThemeProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </GrauityThemeProvider>
  );
}
