import type { Metadata } from "next";
import "./globals.css";
import Topbar from "@/components/Topbar";

export const metadata: Metadata = {
  title: "SlintORM — TypeScript ORM for SQLite, Postgres, MySQL, MongoDB",
  description: "Zero-config TypeScript ORM with auto-migrations, full query builder, preloads, soft delete, and edge/serverless support. Zero dependencies.",
  keywords: ["TypeScript ORM", "SQLite ORM", "PostgreSQL ORM", "auto-migration", "query builder"],
  openGraph: {
    title: "SlintORM",
    description: "Zero-config TypeScript ORM. Write interfaces, get a database.",
    type: "website",
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
