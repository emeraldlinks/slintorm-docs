'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Ordered list of all doc pages — matches sidebar order, deduped
const pages = [
  { label: 'Introduction',                  href: '/docs' },
  { label: 'Installation',                  href: '/docs/installation' },
  { label: 'Configuration',                 href: '/docs/configuration' },
  { label: 'Models',                        href: '/docs/models' },
  { label: 'defineModel',                   href: '/docs/define-model' },
  { label: 'CRUD',                          href: '/docs/crud' },
  { label: 'Query Builder',                 href: '/docs/query-builder' },
  { label: 'select()',                      href: '/docs/query-builder/select' },
  { label: 'where()',                       href: '/docs/query-builder/where' },
  { label: 'Joins',                         href: '/docs/query-builder/joins' },
  { label: 'Ordering & Pagination',         href: '/docs/query-builder/ordering-pagination' },
  { label: 'Preloads',                      href: '/docs/query-builder/preloads' },
  { label: 'Aggregates',                    href: '/docs/query-builder/aggregates' },
  { label: 'Subqueries',                    href: '/docs/query-builder/subqueries' },
  { label: 'Relation Traversal',            href: '/docs/query-builder/relation-traversal' },
  { label: 'Scopes & ExtendedQueryBuilder', href: '/docs/query-builder/scopes' },
  { label: 'Soft Delete',                   href: '/docs/soft-delete' },
  { label: 'Validation',                    href: '/docs/validation' },
  { label: 'Hooks',                         href: '/docs/hooks' },
  { label: 'Transactions',                  href: '/docs/transactions' },
  { label: 'Error Handling',                href: '/docs/error-handling' },
  { label: 'Relations',                     href: '/docs/relations' },
  { label: 'Migrations',                    href: '/docs/migrations' },
  { label: 'CLI',                           href: '/docs/cli' },
  { label: 'Edge / Serverless',             href: '/docs/edge-serverless' },
  { label: 'Drivers',                       href: '/docs/drivers' },
  { label: 'TypeScript',                    href: '/docs/typescript' },
  { label: 'Schema Generation',             href: '/docs/schema-generation' },
  { label: 'Changelog',                     href: '/docs/changelog' },
];

export default function DocPager() {
  const pathname = usePathname();
  const index = pages.findIndex(p => p.href === pathname);
  if (index === -1) return null;

  const prev = index > 0 ? pages[index - 1] : null;
  const next = index < pages.length - 1 ? pages[index + 1] : null;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: prev && next ? '1fr 1fr' : next ? '1fr' : '1fr',
      gap: '0.75rem',
      marginTop: '3rem',
      paddingTop: '1.5rem',
      borderTop: '1px solid var(--color-border)',
    }}>
      {prev && (
        <Link href={prev.href} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem',
          padding: '0.85rem 1rem',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '10px',
          textDecoration: 'none',
          transition: 'border-color 150ms, background 150ms',
          gridColumn: prev && !next ? '1 / -1' : 'auto',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(34,197,94,0.4)';
          (e.currentTarget as HTMLElement).style.background = 'rgba(34,197,94,0.05)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)';
          (e.currentTarget as HTMLElement).style.background = 'var(--color-surface)';
        }}
        >
          <span style={{ fontSize: '0.72rem', color: 'var(--color-fg-subtle)', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Previous
          </span>
          <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-fg)', fontFamily: 'var(--font-mono)' }}>
            {prev.label}
          </span>
        </Link>
      )}

      {next && (
        <Link href={next.href} style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '0.25rem',
          padding: '0.85rem 1rem',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '10px',
          textDecoration: 'none',
          transition: 'border-color 150ms, background 150ms',
          gridColumn: !prev ? '1 / -1' : 'auto',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(34,197,94,0.4)';
          (e.currentTarget as HTMLElement).style.background = 'rgba(34,197,94,0.05)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)';
          (e.currentTarget as HTMLElement).style.background = 'var(--color-surface)';
        }}
        >
          <span style={{ fontSize: '0.72rem', color: 'var(--color-fg-subtle)', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            Next
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </span>
          <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-fg)', fontFamily: 'var(--font-mono)' }}>
            {next.label}
          </span>
        </Link>
      )}
    </div>
  );
}
