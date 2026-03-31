import React from "react";
import "./globals.css";
import "./globals.sass";
import Providers from "./providers";
import Header from "../components/Header/Header";
import StyledComponentsRegistry from "../lib/StyledComponentsRegistry";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <Providers>
            <Header />
            <main>{children}</main>
          </Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
