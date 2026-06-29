import type { Metadata } from "next";
import "./globals.css";
import Topbar from "@/components/Topbar";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://slintorm-docs.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "SlintORM — TypeScript ORM for SQLite, Postgres, MySQL, MongoDB",
    template: "%s — SlintORM",
  },
  description: "Zero-config TypeScript ORM with auto-migrations, full query builder, preloads, soft delete, and edge/serverless support. Zero dependencies.",
  keywords: ["TypeScript ORM", "SQLite ORM", "PostgreSQL ORM", "MySQL ORM", "MongoDB ORM", "auto-migration", "query builder", "edge runtime"],
  authors: [{ name: "Joseph Christopher", url: "https://github.com/emeraldlinks" }],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/icon.png',
  },
  openGraph: {
    title: "SlintORM",
    description: "Zero-config TypeScript ORM. Write interfaces, get a database.",
    type: "website",
    url: baseUrl,
    siteName: "SlintORM",
    images: [{ url: '/logo.png', width: 960, height: 240, alt: 'SlintORM' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SlintORM',
    description: 'Zero-config TypeScript ORM. Write interfaces, get a database.',
    images: ['/logo.png'],
  },
  alternates: {
    canonical: baseUrl,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Topbar />
        {children}
      </body>
    </html>
  );
}
