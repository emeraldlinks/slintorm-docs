'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const nav = [
  {
    group: 'Getting Started',
    items: [
      { label: 'Installation', href: '/docs/installation' },
      { label: 'Configuration', href: '/docs/configuration' },
    ],
  },
  {
    group: 'Core Concepts',
    items: [
      { label: 'Models', href: '/docs/models' },
      { label: 'defineModel', href: '/docs/define-model' },
      { label: 'CRUD', href: '/docs/crud' },
    ],
  },
  {
    group: 'Query Builder',
    items: [
      { label: 'Overview', href: '/docs/query-builder' },
      { label: 'select()', href: '/docs/query-builder/select' },
      { label: 'where()', href: '/docs/query-builder/where' },
      { label: 'Joins', href: '/docs/query-builder/joins' },
      { label: 'Ordering & Pagination', href: '/docs/query-builder/ordering-pagination' },
      { label: 'Preloads', href: '/docs/query-builder/preloads' },
      { label: 'Aggregates', href: '/docs/query-builder/aggregates' },
      { label: 'Subqueries', href: '/docs/query-builder/subqueries' },
      { label: 'Relation Traversal', href: '/docs/query-builder/relation-traversal' },
      { label: 'Scopes & ExtendedQueryBuilder', href: '/docs/query-builder/scopes' },
      { label: 'withTrashed / onlyTrashed', href: '/docs/soft-delete' },
    ],
  },
  {
    group: 'Features',
    items: [
      { label: 'Soft Delete', href: '/docs/soft-delete' },
      { label: 'Validation', href: '/docs/validation' },
      { label: 'Hooks', href: '/docs/hooks' },
      { label: 'Transactions', href: '/docs/transactions' },
      { label: 'Error Handling', href: '/docs/error-handling' },
      { label: 'Relations', href: '/docs/relations' },
    ],
  },
  {
    group: 'Migrations & CLI',
    items: [
      { label: 'Migrations', href: '/docs/migrations' },
      { label: 'CLI', href: '/docs/cli' },
    ],
  },
  {
    group: 'Advanced',
    items: [
      { label: 'Edge / Serverless', href: '/docs/edge-serverless' },
      { label: 'Drivers', href: '/docs/drivers' },
      { label: 'TypeScript', href: '/docs/typescript' },
      { label: 'Schema Generation', href: '/docs/schema-generation' },
      { label: 'Changelog', href: '/docs/changelog' },
    ],
  },
];

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const [open, setOpen] = useState<Record<string, boolean>>(() => {
    const s: Record<string, boolean> = {};
    nav.forEach(g => { s[g.group] = true; });
    return s;
  });

  return (
    <nav style={{
      width: '100%',
      padding: '1rem 0',
    }}>
      <div style={{ padding: '0 1rem 1rem', borderBottom: '1px solid var(--color-border)', marginBottom: '0.5rem' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }} onClick={onClose}>
          <img src="/icon.svg" alt="SlintORM" width="28" height="28" style={{ display: 'block', borderRadius: '6px' }} />
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '1rem',
            fontWeight: 700,
            color: 'var(--color-fg)',
          }}>
            <span style={{ color: 'var(--color-accent)' }}>Slint</span>ORM
          </span>
          <span style={{
            background: 'rgba(34, 197, 94, 0.15)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: '4px',
            fontSize: '0.65rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-accent)',
            padding: '0.1em 0.4em',
          }}>v1.1.4</span>
        </Link>
      </div>

      {nav.map(group => (
        <div key={group.group} style={{ marginBottom: '0.25rem' }}>
          <button
            onClick={() => setOpen(s => ({ ...s, [group.group]: !s[group.group] }))}
            style={{
              width: '100%',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.4rem 1rem',
              color: 'var(--color-fg-subtle)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontWeight: 600,
            }}
          >
            {group.group}
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              style={{ transform: open[group.group] ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 200ms' }}
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {open[group.group] && (
            <div>
              {group.items.map(item => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    style={{
                      display: 'block',
                      padding: '0.4rem 1rem 0.4rem 1.5rem',
                      fontSize: '0.875rem',
                      color: active ? 'var(--color-accent)' : 'var(--color-fg-muted)',
                      background: active ? 'rgba(34, 197, 94, 0.08)' : 'transparent',
                      borderRight: active ? '2px solid var(--color-accent)' : '2px solid transparent',
                      textDecoration: 'none',
                      transition: 'all 150ms',
                      fontWeight: active ? 500 : 400,
                    }}
                    onMouseEnter={e => {
                      if (!active) {
                        (e.currentTarget as HTMLElement).style.color = 'var(--color-fg)';
                        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!active) {
                        (e.currentTarget as HTMLElement).style.color = 'var(--color-fg-muted)';
                        (e.currentTarget as HTMLElement).style.background = 'transparent';
                      }
                    }}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}
