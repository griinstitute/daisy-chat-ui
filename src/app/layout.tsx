import type { Metadata } from "next";
import "./globals.css";
import {
  Hanken_Grotesk,
  Bricolage_Grotesque,
  JetBrains_Mono,
} from "next/font/google";
import React from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-hanken",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bricolage",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "Contact Enricher · GRI Institute",
  description:
    "Find the people you need to reach and get their email, phone, and LinkedIn.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`dark ${hanken.variable} ${bricolage.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-sans">
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  );
}
