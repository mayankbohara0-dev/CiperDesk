import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CipherDesk — Encrypted Startup Workspace",
  description:
    "A secure, end-to-end encrypted workspace for small startups. Real-time messaging, task boards, and file vault — all zero-knowledge, end-to-end encrypted.",
  keywords: [
    "encrypted workspace", "secure team chat", "end-to-end encryption",
    "startup collaboration", "zero trust", "private messaging",
    "zero knowledge", "AES-256", "Signal protocol",
  ],
  openGraph: {
    title: "CipherDesk — Encrypted Startup Workspace",
    description: "Real-time encrypted chat, tasks & file vault. Zero-knowledge, Signal-grade E2EE. For privacy-first startup teams.",
    type: "website",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CipherDesk",
  },
};

export const viewport = {
  themeColor: "#AAEF45",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#AAEF45" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
