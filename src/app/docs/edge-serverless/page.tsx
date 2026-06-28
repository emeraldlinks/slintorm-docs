import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';

export const metadata = { title: 'Edge / Serverless — SlintORM' };

const step1 = `# Step 1: Generate schema JSON at build time
# Run this in CI or before deploying — NOT at edge runtime

npx slintorm generate
# Creates: src/schema/generated.ts
#          src/schema/generated.json`;

const step2 = `// Step 2: Import the generated JSON in your edge code
// Use the 'schema' option — no migrate() call

import schemaJson from './schema/generated.json' assert { type: 'json' };
// or in Next.js:
// const schemaJson = require('./schema/generated.json');`;

const step3 = `// Step 3: Initialize with schema option (no filesystem reads)
import ORMManager from 'slintorm/browser';

const orm = new ORMManager({
  driver: 'postgres',
  databaseUrl: process.env.DATABASE_URL!,
  schema: schemaJson,   // pre-built JSON — no file scanning
  // No 'dir' needed
});

// No orm.migrate() — schema is already applied`;

const nextEdgeRoute = `// app/api/users/route.ts — Next.js Edge Route Handler
import { NextRequest, NextResponse } from 'next/server';
import ORMManager from 'slintorm/browser';
import schemaJson from '@/schema/generated.json';

export const runtime = 'edge';

const orm = new ORMManager({
  driver: 'postgres',
  databaseUrl: process.env.DATABASE_URL!,
  schema: schemaJson,
});

const User = orm.defineModel<User>('users', 'User');

export async function GET(req: NextRequest) {
  const users = await User.getAll();
  return NextResponse.json(users);
}`;

const cloudflareWorker = `// Cloudflare Worker with Hyperdrive (TCP connection pool)
// workers.ts

import ORMManager from 'slintorm/browser';
import schemaJson from './schema/generated.json';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const orm = new ORMManager({
      driver: 'postgres',
      // Use Hyperdrive connection string for Cloudflare TCP
      databaseUrl: env.HYPERDRIVE.connectionString,
      schema: schemaJson,
    });

    const User = orm.defineModel<User>('users', 'User');
    const users = await User.getAll();
    return Response.json(users);
  },
};

// Note: Direct TCP connections to Postgres/MySQL require Cloudflare Hyperdrive.
// Plain pg/mysql2 will not work in Workers without Hyperdrive.`;

const denoEdge = `// Deno Deploy
import ORMManager from 'npm:slintorm/browser';
import schemaJson from './schema/generated.json' assert { type: 'json' };

const orm = new ORMManager({
  driver: 'postgres',
  databaseUrl: Deno.env.get('DATABASE_URL')!,
  schema: schemaJson,
});`;

const ciMigration = `// scripts/migrate.ts — CI/CD migration script
// Run this in your pipeline before deploying to edge

import ORMManager from 'slintorm';   // Node.js — NOT the edge import

const orm = new ORMManager({
  driver: 'postgres',
  databaseUrl: process.env.DATABASE_URL!,
  dir: './src',
});

await orm.migrate();
console.log('Migrations complete');
process.exit(0);

// package.json scripts:
// "db:migrate": "tsx scripts/migrate.ts"`;

const driverMatrix = [
  { runtime: 'Node.js', sqlite: '✓ better-sqlite3 / sqlite3', postgres: '✓ pg', mysql: '✓ mysql2', mongodb: '✓ mongodb' },
  { runtime: 'Next.js (Node)', sqlite: '✓ (serverExternalPackages)', postgres: '✓ pg', mysql: '✓ mysql2', mongodb: '✓ mongodb' },
  { runtime: 'Next.js Edge', sqlite: '✗', postgres: '✓ pg (Neon)', mysql: '✓ mysql2', mongodb: 'HTTP API only' },
  { runtime: 'Cloudflare Workers', sqlite: '✗', postgres: '✓ via Hyperdrive', mysql: '✓ via Hyperdrive', mongodb: 'HTTP API only' },
  { runtime: 'Deno Deploy', sqlite: '✗', postgres: '✓ pg', mysql: '✗', mongodb: 'HTTP API only' },
];

const notAvailableEdge = `// NOT available in edge runtimes (V8 isolates):
// - orm.migrate()         (filesystem reads)
// - npx slintorm generate (Node.js only)
// - SQLite driver         (native binding)
// - Schema auto-generation (scans .ts files)

// The 'browser' export (slintorm/browser) re-exports only what works in V8:
// - ORMManager class
// - defineModel()
// - All query builder methods
// - Validation
// - Hooks`;

export default function EdgeServerlessPage() {
  return (
    <DocLayout>
      <h1 style={{ marginBottom: '0.5rem' }}>Edge / Serverless</h1>
      <p style={{ marginBottom: '2rem', fontSize: '1.05rem' }}>
        SlintORM works in Cloudflare Workers, Deno Deploy, and Next.js Edge routes.
        The key constraint: V8 isolates have no filesystem. Generate the schema JSON at build time
        and pass it in at runtime.
      </p>

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>The 3-step pattern</h2>

      <h3 style={{ marginBottom: '0.5rem', marginTop: '1.5rem', color: 'var(--color-fg-muted)' }}>Step 1 — Generate schema at build time</h3>
      <CodeBlock code={step1} language="bash" />

      <h3 style={{ marginBottom: '0.5rem', marginTop: '1.5rem', color: 'var(--color-fg-muted)' }}>Step 2 — Import the JSON</h3>
      <CodeBlock code={step2} />

      <h3 style={{ marginBottom: '0.5rem', marginTop: '1.5rem', color: 'var(--color-fg-muted)' }}>Step 3 — Initialize with schema option</h3>
      <CodeBlock code={step3} />

      <h2 style={{ marginBottom: '1rem', marginTop: '2.5rem' }}>Driver support matrix</h2>
      <div style={{ border: '1px solid var(--color-border)', borderRadius: '10px', overflow: 'hidden', marginBottom: '2rem' }}>
        <table>
          <thead>
            <tr>
              <th>Runtime</th>
              <th>SQLite</th>
              <th>Postgres</th>
              <th>MySQL</th>
              <th>MongoDB</th>
            </tr>
          </thead>
          <tbody>
            {driverMatrix.map(r => (
              <tr key={r.runtime}>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>{r.runtime}</td>
                <td style={{ color: r.sqlite.startsWith('✓') ? 'var(--color-accent)' : 'var(--color-destructive)', fontSize: '0.85rem' }}>{r.sqlite}</td>
                <td style={{ color: r.postgres.startsWith('✓') ? 'var(--color-accent)' : 'var(--color-fg-subtle)', fontSize: '0.85rem' }}>{r.postgres}</td>
                <td style={{ color: r.mysql.startsWith('✓') ? 'var(--color-accent)' : 'var(--color-fg-subtle)', fontSize: '0.85rem' }}>{r.mysql}</td>
                <td style={{ color: 'var(--color-fg-subtle)', fontSize: '0.85rem' }}>{r.mongodb}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Next.js Edge Route Handler</h2>
      <CodeBlock code={nextEdgeRoute} filename="app/api/users/route.ts" />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Cloudflare Worker (with Hyperdrive)</h2>
      <CodeBlock code={cloudflareWorker} filename="workers.ts" />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Deno Deploy</h2>
      <CodeBlock code={denoEdge} filename="main.ts" />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>CI/CD migration script</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        Run migrations in your Node.js CI pipeline before deploying to edge functions.
        Never call <code>migrate()</code> inside an edge runtime.
      </p>
      <CodeBlock code={ciMigration} filename="scripts/migrate.ts" />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Not available in V8 isolates</h2>
      <CodeBlock code={notAvailableEdge} />
    </DocLayout>
  );
}
