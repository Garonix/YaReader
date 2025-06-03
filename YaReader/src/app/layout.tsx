import "./globals.css";
import { Inter as FontSans } from "next/font/google";
import { metadata, viewport } from './metadata';
import ClientThemeProvider from "@/components/ui/ClientThemeProvider";
import type { ReactNode } from "react";

export { metadata, viewport };

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
      <body className={`${fontSans.variable} font-sans antialiased`}>
        <ClientThemeProvider>
          <div className="min-h-screen bg-background text-foreground">
            {children}
          </div>
        </ClientThemeProvider>
      </body>
    </html>
  );
} 