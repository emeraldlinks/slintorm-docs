import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';

export const metadata = {
  title: 'Edge & Serverless Features — SlintORM',
  description: 'SlintORM edge-compatible features — proxyExec for HTTP-tunneled SQL, custom exec functions, pre-generated schemas for edge runtimes.',
  alternates: { canonical: '/docs/edge-features' },
};

const proxyExecExample = `// proxyExec — HTTP proxy for database access in edge runtimes
import ORMManager, { proxyExec } from 'slintorm';

// Create an exec function that tunnels SQL through an HTTP proxy
const exec = proxyExec({
  endpoint: 'https://your-proxy.com',
  // Optional: authentication
  headers: { Authorization: 'Bearer ' + process.env.PROXY_SECRET! },
});

const orm = new ORMManager({
  exec,
  driver: 'sqlite',   // logical driver for query generation
  schema,              // pre-generated schema (required on edge)
});`;

const customExecExample = `// Custom exec function — full control over SQL execution
import ORMManager from 'slintorm';
import type { ExecFn, SQLExecResult } from 'slintorm';

// Signature: (sql: string, params?: any[]) => Promise<SQLExecResult>
const myExec: ExecFn = async (sql, params) => {
  // Send SQL to your own endpoint or driver
  const result = await myDatabaseClient.query(sql, params);
  return {
    columns: result.fields.map(f => f.name),
    rows: result.rows,
    rowCount: result.rowCount,
  };
};

const orm = new ORMManager({
  exec: myExec,
  driver: 'postgres',
  schema,
});`;

const schemaGenerateExample = `// Pre-generated schema — no filesystem reads at runtime
// Run at build time:
// npx slintorm generate

// Import the generated schema
import { schema } from './schema/generated';

// Pass it to ORMManager constructor
const orm = new ORMManager({
  driver: 'sqlite',
  schema,  // Skips filesystem scan entirely
});`;

const replicasExample = `// Read replicas for edge
const orm = new ORMManager({
  driver: 'postgres',
  databaseUrl: process.env.PG_WRITER_URL!,
  replicas: [
    { databaseUrl: process.env.PG_REPLICA_1_URL! },
    { databaseUrl: process.env.PG_REPLICA_2_URL! },
  ],
  schema,
});`;

const cfWorkersExample = `// Complete example — Cloudflare Workers
import ORMManager, { proxyExec } from 'slintorm';
import schema from './schema.json';

// In Cloudflare Workers, direct TCP connections are unavailable.
// Use proxyExec to tunnel through an HTTP proxy service.
const exec = proxyExec({
  endpoint: 'https://db-proxy.example.com',
  headers: {
    Authorization: 'Bearer ' + (process.env as any).PROXY_SECRET!,
  },
});

const orm = new ORMManager({
  driver: 'sqlite',
  exec,
  schema,    // Required — no filesystem in Workers
  logs: false,
});

export default {
  async fetch(request: Request): Promise<Response> {
    orm.withContext({ requestId: request.headers.get('cf-ray') });

    try {
      const users = await orm.DB.User.getAll();
      return Response.json({ users });
    } finally {
      orm.clearContext();
    }
  },
};`;

export default function EdgeFeaturesPage() {
  return (
    <DocLayout>
      <h1 style={{ marginBottom: '0.5rem' }}>Edge & Serverless Features</h1>
      <p style={{ marginBottom: '2rem', fontSize: '1.05rem' }}>
        SlintORM is designed for edge runtimes where traditional TCP-based database drivers
        are unavailable. Use <code>proxyExec</code>, custom <code>ExecFn</code>
        implementations, and pre-generated schemas to run in Cloudflare Workers, Vercel Edge,
        Deno, and Bun.
      </p>

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>proxyExec — HTTP proxy for SQL</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        <code>proxyExec</code> creates an <code>ExecFn</code> that sends SQL statements over HTTP
        to a proxy server, which executes them against the database. This bypasses the need for
        direct TCP connections — ideal for edge runtimes that only support HTTP.
      </p>
      <CodeBlock code={proxyExecExample} filename="edge-db.ts" />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Custom exec functions</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        Pass any function matching <code>ExecFn</code> to <code>ORMManager</code> to bypass
        SlintORM's built-in TCP-based drivers. This works in Cloudflare Workers, Deno, Vercel Edge,
        and Bun — anywhere you can execute SQL but can't open raw TCP sockets.
      </p>
      <div style={{ border: '1px solid var(--color-border)', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.85rem', background: 'rgba(59, 130, 246, 0.06)' }}>
        <code><strong>ExecFn</strong> = (sql: string, params?: any[]) =&gt; Promise&lt;SQLExecResult&gt;</code>
      </div>
      <CodeBlock code={customExecExample} filename="custom-exec.ts" />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Pre-generated schemas</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        Edge runtimes typically lack filesystem access. Run <code>npx slintorm generate</code> at
        build time to produce a JSON schema, then pass it to the constructor. This eliminates all
        runtime filesystem reads.
      </p>
      <CodeBlock code={schemaGenerateExample} filename="edge-db.ts" />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Read replicas on edge</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        Use the <code>replicas</code> config option to distribute read queries across replicas
        while directing writes to the primary.
      </p>
      <CodeBlock code={replicasExample} filename="edge-db.ts" />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2.5rem' }}>End-to-end: Cloudflare Workers</h2>
      <CodeBlock code={cfWorkersExample} filename="worker.ts" />

      <h2 style={{ marginBottom: '0.5rem', marginTop: '2.5rem' }}>Limitations & considerations</h2>
      <ul style={{ color: 'var(--color-fg-subtle)', lineHeight: '1.8' }}>
        <li><code>proxyExec</code> adds HTTP latency — keep your proxy server geographically close to your edge runtime.</li>
        <li>Pre-generated schemas must be regenerated when models change (add to your CI/CD pipeline).</li>
        <li>Custom <code>ExecFn</code> implementations must handle parameter binding and return the correct <code>SQLExecResult</code> shape.</li>
        <li>Not all drivers are supported in all edge runtimes — test your specific runtime before deploying.</li>
        <li>Connection pooling is managed externally when using <code>proxyExec</code>; configure pool size on your proxy server.</li>
      </ul>
    </DocLayout>
  );
}
