import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';

export const metadata = {
  title: 'Installation — SlintORM',
  description: "Install SlintORM and its optional database drivers — SQLite, PostgreSQL, MySQL, MongoDB. Zero runtime dependencies.",
  alternates: { canonical: '/docs/installation' },
};

const installBase = `npm install slintorm`;
const installSqlite = `# Recommended (synchronous, WAL mode, fastest)
npm install better-sqlite3
npm install -D @types/better-sqlite3

# Alternative (async, broader env support)
npm install sqlite3 sqlite`;
const installPg = `npm install pg
npm install -D @types/pg`;
const installMysql = `npm install mysql2`;
const installMongo = `npm install mongodb`;
const nextConfig = `// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['better-sqlite3', 'sqlite3'],
};

export default nextConfig;`;

const drivers = [
  { name: 'better-sqlite3', driver: '"sqlite"', usage: 'Local dev, desktop, CI — fastest', mode: 'Sync (wrapped async)' },
  { name: 'sqlite3 + sqlite', driver: '"sqlite"', usage: 'Async SQLite fallback', mode: 'Async' },
  { name: 'pg', driver: '"postgres"', usage: 'PostgreSQL, Neon, Supabase, RDS', mode: 'Async' },
  { name: 'mysql2', driver: '"mysql"', usage: 'MySQL, PlanetScale, TiDB', mode: 'Async' },
  { name: 'mongodb', driver: '"mongodb"', usage: 'MongoDB Atlas / self-hosted', mode: 'Async' },
];

export default function InstallationPage() {
  return (
    <DocLayout>
      <h1 style={{ marginBottom: '0.5rem' }}>Installation</h1>
      <p style={{ marginBottom: '2rem', fontSize: '1.05rem' }}>
        SlintORM has zero runtime dependencies. Install the core package, then add only the driver you need.
      </p>

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Core package</h2>
      <CodeBlock code={installBase} language="bash" />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2.5rem' }}>Driver peer dependencies</h2>
      <p style={{ marginBottom: '1.5rem' }}>
        All database drivers are optional peerDependencies. Install only what matches your database.
      </p>

      <div style={{ border: '1px solid var(--color-border)', borderRadius: '10px', overflow: 'hidden', marginBottom: '2rem' }}>
        <table>
          <thead>
            <tr>
              <th>Package</th>
              <th>driver value</th>
              <th>When to use</th>
              <th>Mode</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map(d => (
              <tr key={d.name}>
                <td><code>{d.name}</code></td>
                <td><code>{d.driver}</code></td>
                <td style={{ color: 'var(--color-fg-subtle)' }}>{d.usage}</td>
                <td style={{ color: 'var(--color-fg-subtle)' }}>{d.mode}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>SQLite</h3>
      <CodeBlock code={installSqlite} language="bash" />

      <h3 style={{ marginBottom: '0.75rem', marginTop: '1.5rem' }}>PostgreSQL</h3>
      <CodeBlock code={installPg} language="bash" />

      <h3 style={{ marginBottom: '0.75rem', marginTop: '1.5rem' }}>MySQL</h3>
      <CodeBlock code={installMysql} language="bash" />

      <h3 style={{ marginBottom: '0.75rem', marginTop: '1.5rem' }}>MongoDB</h3>
      <CodeBlock code={installMongo} language="bash" />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2.5rem' }}>Next.js / Turbopack</h2>
      <p style={{ marginBottom: '1rem' }}>
        Native SQLite bindings must be excluded from bundling. Add <code>serverExternalPackages</code> to your config:
      </p>
      <CodeBlock code={nextConfig} filename="next.config.ts" />

      <div style={{
        background: 'rgba(34, 197, 94, 0.08)',
        border: '1px solid rgba(34, 197, 94, 0.2)',
        borderRadius: '8px',
        padding: '1rem 1.25rem',
        marginTop: '2rem',
        fontSize: '0.875rem',
      }}>
        <strong style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-mono)' }}>Edge runtimes</strong>
        <p style={{ marginTop: '0.25rem', color: 'var(--color-fg-muted)' }}>
          For Cloudflare Workers, Deno Deploy, and Next.js Edge routes, import from <code>slintorm/browser</code>
          and pass a pre-built <code>schema</code> JSON. Native drivers are not available in V8 isolates.
          See the <a href="/docs/edge-serverless">Edge guide</a>.
        </p>
      </div>
    </DocLayout>
  );
}
