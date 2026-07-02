import Link from 'next/link';
import CodeBlock from '@/components/CodeBlock';
import FeatureCard from '@/components/FeatureCard';
import { VERSION } from '@/lib/config';

const quickstart = `import ORMManager from 'slintorm';

interface User {
  // @auto;primaryKey
  id: number;
  // @unique
  email: string;
  name: string;
}

const orm = new ORMManager({ driver: 'sqlite', databaseUrl: './dev.db' });
await orm.migrate();

const User = orm.defineModel<User>('users', 'User');
const user = await User.insert({ email: 'joe@example.com', name: 'Joe' });
console.log(user.id); // 1`;

const features = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 4h16v16H4z" rx="2"/><path d="M4 9h16M9 9v11"/>
      </svg>
    ),
    title: 'Auto-migrations',
    desc: 'Write TypeScript interfaces. Run orm.migrate(). Columns appear, alter-table handled non-destructively.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
      </svg>
    ),
    title: 'Full query builder',
    desc: 'Fluent chainable API: where, join, orderBy, paginate, groupBy, window functions, EXISTS subqueries.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: 'Preloads, no N+1',
    desc: 'preload("relation") batch-fetches related records. Nested preloads, cycle detection, exclude() built in.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
        <path d="M10 11v6M14 11v6M9 6V4h6v2"/>
      </svg>
    ),
    title: 'Soft delete',
    desc: '@softDelete on deletedAt. Queries auto-filter. withTrashed(), onlyTrashed(), restore() built in.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
    title: 'Edge / serverless ready',
    desc: 'Pre-generate schema JSON. Import at runtime, no filesystem reads. Works in Cloudflare Workers, Deno, Next.js Edge.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/>
      </svg>
    ),
    title: 'Zero dependencies',
    desc: "All drivers (pg, mysql2, better-sqlite3, mongodb) are optional peerDependencies. Ship nothing you don't use.",
  },
];

const comparison = [
  { feature: 'Auto-migrations from interfaces', slint: true, drizzle: false, prisma: false },
  { feature: 'Zero runtime dependencies', slint: true, drizzle: true, prisma: false },
  { feature: 'Edge / serverless ready', slint: true, drizzle: true, prisma: true },
  { feature: 'Soft delete built in', slint: true, drizzle: false, prisma: false },
  { feature: 'Lifecycle hooks', slint: true, drizzle: false, prisma: true },
  { feature: 'Relation traversal (relatedTo)', slint: true, drizzle: false, prisma: false },
  { feature: 'No schema file required', slint: true, drizzle: false, prisma: false },
  { feature: 'SQLite WAL mode', slint: true, drizzle: true, prisma: true },
  { feature: 'MongoDB support', slint: true, drizzle: false, prisma: true },
  { feature: 'Validation API built in', slint: true, drizzle: false, prisma: false },
];

export default function Home() {
  return (
    <div style={{ paddingTop: '56px' }}>
      {/* Hero */}
      <section style={{
        minHeight: 'calc(100vh - 56px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '4rem 1.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `linear-gradient(rgba(34,197,94,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.04) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black, transparent)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black, transparent)',
        }}/>

        <div style={{ position: 'relative', maxWidth: '780px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)',
            borderRadius: '100px', padding: '0.35rem 0.9rem',
            fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--color-accent)',
            marginBottom: '2rem',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-accent)', display: 'inline-block' }}/>
            v{VERSION} — now with edge runtime support
          </div>

          {/* Logo */}
          <div style={{ marginBottom: '1.75rem' }}>
            <img
              src="/logo.svg"
              alt="SlintORM"
              style={{ height: '52px', display: 'inline-block' }}
            />
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, lineHeight: 1.1, marginBottom: '1.25rem', letterSpacing: '-0.03em' }}>
            Zero-config TypeScript ORM.<br />
            <span style={{ color: 'var(--color-accent)' }}>Write interfaces, get a database.</span>
          </h1>

          <p style={{ fontSize: '1.125rem', color: 'var(--color-fg-muted)', lineHeight: 1.7, maxWidth: '560px', margin: '0 auto 2.5rem' }}>
            Auto-migrations from your TypeScript interfaces. Full query builder. Preloads that don&apos;t N+1.
            Runs anywhere from SQLite to Cloudflare Workers.
          </p>

          <div style={{ maxWidth: '380px', margin: '0 auto 2.5rem' }}>
            <div style={{
              background: '#0D1B2E', border: '1px solid var(--color-border)', borderRadius: '10px',
              padding: '0.85rem 1.25rem', fontFamily: 'var(--font-mono)', fontSize: '1rem',
              color: '#86EFAC', display: 'flex', alignItems: 'center', gap: '0.75rem', textAlign: 'left',
            }}>
              <span style={{ color: 'var(--color-fg-subtle)' }}>$</span>
              npm install slintorm
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/docs/installation" style={{
              background: 'var(--color-accent)', color: '#0F172A', fontWeight: 600,
              fontFamily: 'var(--font-mono)', fontSize: '0.9rem', padding: '0.7rem 1.5rem',
              borderRadius: '8px', textDecoration: 'none', transition: 'all 200ms',
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            }}>
              Get started
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <a href="https://github.com/emeraldlinks/slintorm" target="_blank" rel="noreferrer" style={{
              background: 'transparent', color: 'var(--color-fg-muted)', fontFamily: 'var(--font-mono)',
              fontSize: '0.9rem', padding: '0.7rem 1.5rem', borderRadius: '8px', textDecoration: 'none',
              border: '1px solid var(--color-border)', transition: 'all 200ms',
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Quickstart */}
      <section style={{ padding: '4rem 1.5rem', maxWidth: '860px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>5-line quickstart</h2>
        <p style={{ marginBottom: '1.5rem', color: 'var(--color-fg-muted)' }}>
          Define an interface. Initialize the ORM. Call migrate(). Your database is ready.
        </p>
        <CodeBlock code={quickstart} filename="db.ts" />
      </section>

      {/* Features grid */}
      <section style={{ padding: '4rem 1.5rem', borderTop: '1px solid var(--color-border)' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', fontSize: '1.5rem' }}>Everything you need</h2>
          <p style={{ textAlign: 'center', color: 'var(--color-fg-muted)', marginBottom: '3rem' }}>
            No schema files. No codegen. No config sprawl.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
            {features.map(f => (
              <FeatureCard key={f.title} icon={f.icon} title={f.title} desc={f.desc} />
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section style={{ padding: '4rem 1.5rem', borderTop: '1px solid var(--color-border)' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <h2 style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>How it compares</h2>
          <p style={{ color: 'var(--color-fg-muted)', marginBottom: '2rem' }}>
            SlintORM ships with more out of the box than any comparable library.
          </p>
          <div style={{ border: '1px solid var(--color-border)', borderRadius: '10px', overflow: 'hidden' }}>
            <table>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th style={{ textAlign: 'center', color: 'var(--color-accent)' }}>SlintORM</th>
                  <th style={{ textAlign: 'center' }}>Drizzle</th>
                  <th style={{ textAlign: 'center' }}>Prisma</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map(row => (
                  <tr key={row.feature}>
                    <td>{row.feature}</td>
                    <td style={{ textAlign: 'center' }}>
                      {row.slint ? <span style={{ color: 'var(--color-accent)' }}>✓</span> : <span style={{ color: 'var(--color-fg-subtle)' }}>—</span>}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {row.drizzle ? <span style={{ color: '#60A5FA' }}>✓</span> : <span style={{ color: 'var(--color-fg-subtle)' }}>—</span>}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {row.prisma ? <span style={{ color: '#60A5FA' }}>✓</span> : <span style={{ color: 'var(--color-fg-subtle)' }}>—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--color-border)', padding: '2rem 1.5rem', textAlign: 'center',
        color: 'var(--color-fg-subtle)', fontSize: '0.875rem', fontFamily: 'var(--font-mono)',
      }}>
        <p style={{ marginBottom: '0.5rem' }}>
          SlintORM &mdash; MIT License &mdash;{' '}
          <a href="https://github.com/emeraldlinks/slintorm" style={{ color: 'var(--color-fg-subtle)' }}>GitHub</a> &mdash;{' '}
          <a href="https://www.npmjs.com/package/slintorm" style={{ color: 'var(--color-fg-subtle)' }}>npm</a>
        </p>
        <p>
          <a
            href="/llms.txt"
            download
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              color: 'var(--color-accent)', fontSize: '0.8rem', textDecoration: 'none',
              border: '1px solid rgba(34,197,94,0.25)', borderRadius: '6px', padding: '0.3rem 0.75rem',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            llms.txt — full API reference for AI models
          </a>
        </p>
      </footer>
    </div>
  );
}
