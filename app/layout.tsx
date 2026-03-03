import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CipherDesk — Encrypted Startup Workspace",
  description:
    "A secure, end-to-end encrypted workspace for small startups. Real-time messaging, task management, and file vault — all zero-knowledge.",
  keywords: [
    "encrypted workspace",
    "secure team chat",
    "end-to-end encryption",
    "startup collaboration",
    "zero trust",
    "private messaging",
  ],
  openGraph: {
    title: "CipherDesk — Encrypted Startup Workspace",
    description:
      "Telegram-level speed. Slack-level structure. Signal-level encryption. For indie hackers and small SaaS teams.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen bg-dark text-slate-100 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
