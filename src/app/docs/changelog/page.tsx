import DocLayout from '@/components/DocLayout';

export const metadata = { title: 'Changelog — SlintORM' };

const v114 = [
  { type: 'feat', text: 'Edge / serverless runtime support via slintorm/browser export condition' },
  { type: 'feat', text: 'schema option on ORMManagerConfig — pass pre-built JSON, skip filesystem reads' },
  { type: 'feat', text: 'browser.ts entrypoint — safe re-export for V8 isolates (Cloudflare Workers, Deno Deploy, Next.js Edge)' },
  { type: 'feat', text: 'drop-tracking CLI command — removes _slint_migrations table without dropping data tables' },
  { type: 'fix', text: 'whereRaw now correctly accepts optional params as second argument (BUG FIX #3)' },
  { type: 'fix', text: 'Dot-notation column qualification in where() after manual joins (BUG FIX #2)' },
  { type: 'fix', text: 'Critical rollback bug: duplicate migration tracking entries no longer created after rollback' },
  { type: 'fix', text: 'JSON field metadata key mismatch resolved (@json and json both accepted by migrator)' },
  { type: 'fix', text: 'applyPreloads cycle detection prevents infinite loops on circular relation graphs' },
  { type: 'improve', text: 'CLI timestamped logging and progress bars for migrate, rollback, and fresh commands' },
  { type: 'improve', text: 'Prepared statement cache for SQLite raised to 200 entries' },
  { type: 'improve', text: 'insertMany on SQLite now wraps all inserts in a single transaction for speed' },
  { type: 'docs', text: 'README.md — complete rewrite with driver matrix, field metadata table, relation examples' },
  { type: 'docs', text: 'QUERY_BUILDER.md — full query builder method reference' },
  { type: 'docs', text: 'SERVERLESS.md — edge runtime quickstart and CI/CD migration pattern' },
  { type: 'docs', text: 'example.ts / llms.txt — real-world usage examples for AI context windows' },
];

const typeColors: Record<string, { bg: string; color: string; label: string }> = {
  feat:    { bg: 'rgba(34, 197, 94, 0.12)',  color: '#86EFAC', label: 'feat' },
  fix:     { bg: 'rgba(239, 68, 68, 0.12)',  color: '#FCA5A5', label: 'fix' },
  improve: { bg: 'rgba(59, 130, 246, 0.12)', color: '#93C5FD', label: 'improve' },
  docs:    { bg: 'rgba(156, 163, 175, 0.1)', color: '#9CA3AF', label: 'docs' },
};

export default function ChangelogPage() {
  return (
    <DocLayout>
      <h1 style={{ marginBottom: '0.5rem' }}>Changelog</h1>
      <p style={{ marginBottom: '2.5rem', fontSize: '1.05rem' }}>
        Release history for SlintORM. All notable changes documented here.
      </p>

      {/* v1.1.4 */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.35rem', margin: 0 }}>v1.1.4</h2>
          <span style={{
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.25)',
            borderRadius: '100px',
            padding: '0.2rem 0.7rem',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-accent)',
          }}>latest</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {v114.map((entry, i) => {
            const tc = typeColors[entry.type];
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  padding: '0.6rem 0.75rem',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                }}
              >
                <span style={{
                  background: tc.bg,
                  color: tc.color,
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  padding: '0.15rem 0.5rem',
                  borderRadius: '4px',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  marginTop: '0.1rem',
                }}>
                  {tc.label}
                </span>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-fg-muted)', lineHeight: 1.6 }}>
                  {entry.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Older versions placeholder */}
      <div style={{
        borderTop: '1px solid var(--color-border)',
        paddingTop: '2rem',
        color: 'var(--color-fg-subtle)',
        fontSize: '0.875rem',
        textAlign: 'center',
      }}>
        <p>Earlier versions are available on <a href="https://www.npmjs.com/package/slintorm?activeTab=versions" target="_blank" rel="noreferrer">npm</a> and in the <a href="https://github.com/emeraldlinks/slintorm/releases" target="_blank" rel="noreferrer">GitHub releases</a>.</p>
      </div>
    </DocLayout>
  );
}
