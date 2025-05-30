import "./globals.css";
import { Inter as FontSans } from "next/font/google";
import { metadata } from './metadata';
import ClientThemeProvider from "@/components/ui/ClientThemeProvider";
import type { ReactNode } from "react";

export { metadata };

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
      </head>
      <body className={`${fontSans.variable} font-sans`}>
        <ClientThemeProvider>
          {children}
        </ClientThemeProvider>
      </body>
    </html>
  );
} 