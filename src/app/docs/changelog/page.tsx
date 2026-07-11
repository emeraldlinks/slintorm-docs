import DocLayout from '@/components/DocLayout';
import { VERSION } from '@/lib/config';

export const metadata = {
  title: 'Changelog',
  description: 'SlintORM release history — real commits from GitHub, grouped by version.',
  alternates: { canonical: '/docs/changelog' },
};

// Grouped from real GitHub commits on emeraldlinks/slintorm
const releases = [
  {
    version: '1.5.1',
    date: '2026-07-09',
    latest: true,
    groups: [
      {
        label: 'fix',
        items: [
          'Schema generator now supports inline annotations: `field: string; // @unique` — warns but works',
          'Schema generator handles stacked `//` annotation comments above a field (multiple lines)',
          'Schema generator no longer errors on `//` comment lines inside interface bodies',
          'Inline annotations and stacked comments properly separated with `;` — no merged metadata keys',
        ],
      },
    ],
  },
  {
    version: '1.5.0',
    date: '2026-07-09',
    latest: false,
    groups: [
      {
        label: 'feat',
        items: [
          '@mask annotation with 8 presets/directives — ssn, creditcard, email, phone, showFirst:N, showLast:N, showBoth:F,L, char:X, pattern:...',
          '@omitdb — exclude field from database entirely (no column stored)',
          '@omitjson — store in DB, strip from all read results unless explicitly .select()ed',
          '@omitmigrate — migrator never creates/alters/drops the column; manual DDL',
          '.withoutMasking() query builder modifier — bypass masking for privileged callers',
          'stripOmitDb() helper on get/getAll — automatically excludes @omitdb fields from reads',
        ],
      },
      {
        label: 'docs',
        items: [
          'All model interfaces consolidated into single src/interfaces.ts — no more duplicate interface definitions',
          'Build yields zero TypeScript errors for the first time',
        ],
      },
    ],
  },
  {
    version: '1.4.0',
    date: '2026-07-08',
    latest: false,
    groups: [
      {
        label: 'feat',
        items: [
          'Pushed remote — slintorm repo + docs site deployed',
        ],
      },
    ],
  },
  {
    version: '1.3.1',
    date: '2026-07-04',
    latest: true,
    groups: [
      {
        label: 'fix',
        items: [
          'Boolean values serialized to 0/1 on all write paths (insert, update, query builder)',
          'query().where(), .first(), .update(), .delete() no longer throw sqlite3 binding error with boolean params',
          'insert() now uses serializeValue — eliminates duplicate inline logic',
        ],
      },
    ],
  },
  {
    version: '1.3.0',
    date: '2026-07-04',
    latest: false,
    groups: [
      {
        label: 'feat',
        items: [
          '@random annotation for auto-generated field values (string:N, number:N)',
          'EntityWithUpdate methods on query builder results (.get(), .first())',
          'Bulk delete() and update() on QueryBuilder — execute DELETE/UPDATE from accumulated WHERE clauses',
        ],
      },
      {
        label: 'fix',
        items: [
          'Insert refetch logic now handles @random PKs — no longer overwrites string UUIDs with SQLite lastID',
          '@json fields auto-detected for inferred (schema-less) models',
          'Plain objects JSON-serialized in insert() and deserialized in get() without explicit @json annotation',
        ],
      },
    ],
  },
  {
    version: '1.1.5',
    date: '2026-06-28',
    latest: false,
    groups: [
      {
        label: 'fix',
        items: [
          'Apply SlintORM fixed updates across the codebase (59fcce4)',
          'Fixed typing failure in .where() — operator comparison now correctly narrows type (df23fac)',
        ],
      },
      {
        label: 'fix',
        items: [
          'Fixed relatedTo BFS algorithm — path discovery now handles multi-hop relations correctly (f59495f)',
          'Fixed relation and join errors in query builder (c34efff)',
        ],
      },
      {
        label: 'docs',
        items: [
          'Published official documentation site (e8d5b6f)',
        ],
      },
    ],
  },
  {
    version: '1.1.4',
    date: '2026-06-20',
    latest: false,
    groups: [
      {
        label: 'fix',
        items: [
          'Fixed CLI generate path resolver bug — paths now resolved relative to project root (bb40ac8)',
          'Fixed extra field appearing in migrated tables (d23946b)',
          'Fixed relatedTo type keys — generic inference now correct on chained calls (1ed39a6, c42effb)',
          'Fixed issues with migrator — alter-table no longer drops columns incorrectly (4a621b9, c4e28e)',
        ],
      },
      {
        label: 'feat',
        items: [
          'Finished CLI tool — generate, migrate, rollback, status, fresh, drop-tracking (1af8059)',
          'Added complex relation tracking for BFS path discovery (87b82da)',
          'Published to npm (e1e3a9a)',
        ],
      },
      {
        label: 'improve',
        items: [
          'Fixed QueryBuilder bugs and added new helper methods (77bee9a)',
          'Fixed type field skipping at migration time (fde906a)',
        ],
      },
    ],
  },
  {
    version: '1.1.0',
    date: '2026-06-10',
    latest: false,
    groups: [
      {
        label: 'feat',
        items: [
          'Added Next.js and bundler support — serverExternalPackages, dynamic driver imports (a422a39)',
          'Added tokenizer-based schema generator — no ts-morph or compiler dependency (bd553d9)',
          'Fixed path and fs bugs for cross-platform compatibility (8332686)',
        ],
      },
      {
        label: 'fix',
        items: [
          'Fixed path errors and generator output (a790a6c)',
          'Added fixes and stability improvements (6bceae7)',
        ],
      },
    ],
  },
  {
    version: '1.0.0',
    date: '2026-05-31',
    latest: false,
    groups: [
      {
        label: 'feat',
        items: [
          'Stable 1.0.0 release — bumped from pre-release (0403ded)',
          'Added many-to-many relationship support with pivot table auto-creation (e4a631d)',
          'Added manytoone relationship support (9556a06)',
          'Added better TypeScript type support throughout (3eeeb86)',
        ],
      },
      {
        label: 'improve',
        items: [
          'Removed ts-morph dependency — zero compile-time dependencies (91caae0)',
          'Fixed major bugs, improved query generation speed and efficiency (78590ff)',
        ],
      },
    ],
  },
  {
    version: '0.x',
    date: '2025-11-15',
    latest: false,
    groups: [
      {
        label: 'feat',
        items: [
          'Added full PostgreSQL support in queries (4f0c921)',
          'Added more directive supports — @enum, @json, @softDelete, @comment (c4d5b6d)',
          'Fixed migration errors and model interface directives (d77e607)',
        ],
      },
      {
        label: 'improve',
        items: [
          'Initial public release — SQLite, Postgres drivers, basic query builder (2f6e628)',
        ],
      },
    ],
  },
];

const typeColors: Record<string, { bg: string; color: string }> = {
  feat:    { bg: 'rgba(34, 197, 94, 0.12)',  color: '#86EFAC' },
  fix:     { bg: 'rgba(239, 68, 68, 0.12)',  color: '#FCA5A5' },
  improve: { bg: 'rgba(59, 130, 246, 0.12)', color: '#93C5FD' },
  docs:    { bg: 'rgba(156, 163, 175, 0.1)', color: '#9CA3AF' },
};

export default function ChangelogPage() {
  return (
    <DocLayout>
      <h1 style={{ marginBottom: '0.5rem' }}>Changelog</h1>
      <p style={{ marginBottom: '0.5rem', fontSize: '1.05rem' }}>
        Release history for SlintORM — sourced from real GitHub commits.
      </p>
      <p style={{ marginBottom: '2.5rem', fontSize: '0.875rem', color: 'var(--color-fg-subtle)' }}>
        Current version: <code>v{VERSION}</code> &mdash;{' '}
        <a href="https://github.com/emeraldlinks/slintorm/commits/main" target="_blank" rel="noreferrer">
          view all commits on GitHub
        </a>
      </p>

      {releases.map(release => (
        <div key={release.version} style={{ marginBottom: '3rem' }}>
          {/* Version header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--color-border)' }}>
            <h2 style={{ fontSize: '1.35rem', margin: 0, fontFamily: 'var(--font-mono)' }}>
              v{release.version}
            </h2>
            {release.latest && (
              <span style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.25)',
                borderRadius: '100px',
                padding: '0.2rem 0.7rem',
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--color-accent)',
              }}>latest</span>
            )}
            <span style={{ color: 'var(--color-fg-subtle)', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', marginLeft: 'auto' }}>
              {release.date}
            </span>
          </div>

          {/* Commit groups */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            {release.groups.flatMap((group, gi) =>
              group.items.map((item, ii) => {
                const tc = typeColors[group.label] ?? typeColors.docs;
                return (
                  <div key={`${gi}-${ii}`} style={{
                    display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                    padding: '0.6rem 0.75rem',
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                  }}>
                    <span style={{
                      background: tc.bg, color: tc.color,
                      fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 600,
                      padding: '0.15rem 0.5rem', borderRadius: '4px',
                      whiteSpace: 'nowrap', flexShrink: 0, marginTop: '0.1rem',
                    }}>{group.label}</span>
                    <span style={{ fontSize: '0.875rem', color: 'var(--color-fg-muted)', lineHeight: 1.6 }}>
                      {item}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ))}

      <div style={{
        borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem',
        color: 'var(--color-fg-subtle)', fontSize: '0.875rem', textAlign: 'center',
      }}>
        <a href="https://github.com/emeraldlinks/slintorm/commits/main" target="_blank" rel="noreferrer">
          Full commit history on GitHub →
        </a>
      </div>
    </DocLayout>
  );
}
