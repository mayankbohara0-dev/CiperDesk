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
    description: "Telegram-level speed. Slack-level structure. Signal-level encryption. For indie hackers and small SaaS teams.",
    type: "website",
  },
  manifest: "/manifest.json",
  themeColor: "#6366F1",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CipherDesk",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#6366F1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body style={{ minHeight: "100vh", background: "#030711", color: "#F8FAFC" }}>
        {children}
      </body>
    </html>
  );
}
