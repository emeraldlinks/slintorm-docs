import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';
import Link from 'next/link';

export const metadata = {
  title: 'Query Builder — SlintORM',
  description: "SlintORM query builder overview — all builder entry points, terminal methods, chaining, and per-driver SQL dialect differences.",
  alternates: { canonical: '/docs/query-builder' },
};

const entryPoints = `// Four builder entry points — each returns a different builder class

// QueryBuilder<T> — base, covers the majority of queries
model.query()

// AdvancedQueryBuilder<T> — extends QueryBuilder with aggregates,
// window functions, UNION, RIGHT/FULL OUTER joins, subqueries
model.advanced()

// SoftDeleteQueryBuilder<T> — extends QueryBuilder with
// withTrashed() and onlyTrashed() for soft-deleted rows
model.softDelete()

// ExtendedQueryBuilder<T> — extends QueryBuilder with scope()
model.extended()`;

const terminalMethods = `// Terminal methods — execute the query and return results

// .get() — execute and return all matching rows as EntityWithUpdate<T>[]
const users = await User.query()
  .where('role', '=', 'admin')
  .orderBy('name', 'ASC')
  .get();

// .first(condition?) — execute and return first row or null
// condition: raw SQL string OR partial filter object (both optional)
const user = await User.query()
  .orderBy('createdAt', 'DESC')
  .first();                         // no condition — first row

const admin = await User.query()
  .first('role = "admin"');         // raw SQL condition

const mod = await User.query()
  .first({ role: 'moderator' });    // partial filter object

// .getPaginated(page, perPage) — execute and return paginated result
const result = await Post.query()
  .where('published', '=', true)
  .getPaginated(1, 20);
// { data: Post[], total: number, page: number, lastPage: number }`;

const dialectSQL = `// Dialects — the QB emits different SQL per driver automatically
// You write the same query builder code; SlintORM adapts the output

// SQLite
// - Placeholders:  ?  (positional)
// - Identifiers:   unquoted or "double-quoted"
// - AUTOINCREMENT: INTEGER PRIMARY KEY AUTOINCREMENT
// - Upsert:        INSERT OR REPLACE / manual fallback
// - ILIKE:         LIKE (SQLite LIKE is case-insensitive for ASCII)
//
// PostgreSQL
// - Placeholders:  $1, $2, $3  (numbered)
// - Identifiers:   "double-quoted"
// - AUTOINCREMENT: SERIAL / BIGSERIAL
// - Upsert:        ON CONFLICT (col) DO UPDATE SET ...
// - ILIKE:         ILIKE  (native)
// - RETURNING *:   used on every INSERT to return the full row
//
// MySQL
// - Placeholders:  ?  (positional)
// - Identifiers:   \`backtick-quoted\`
// - AUTOINCREMENT: AUTO_INCREMENT
// - Upsert:        ON DUPLICATE KEY UPDATE ...
// - ILIKE:         LIKE  (case-insensitive by default collation)
//
// MongoDB
// - No SQL — translates to: find / insertOne / updateMany / deleteMany / countDocuments
// - Aggregation pipeline for groupBy/having
// - No JOIN support (use preloads instead)
// - No transaction support

// Example: the same QB call emits different SQL per driver
User.query().where('email', '=', 'joe@example.com').get();

// SQLite/MySQL output:
// SELECT * FROM users WHERE email = ? AND deletedAt IS NULL
// params: ['joe@example.com']

// Postgres output:
// SELECT * FROM users WHERE email = $1 AND deletedAt IS NULL
// params: ['joe@example.com']`;

const builderChaining = `// All non-terminal methods return 'this' — fully chainable
const result = await User.query()
  .select('id', 'name', 'email')
  .where('active', '=', true)
  .whereNotNull('verifiedAt')
  .whereIn('role', ['admin', 'moderator'])
  .orderBy('name', 'ASC')
  .limit(50)
  .offset(0)
  .get();

// The builder accumulates clauses until a terminal method is called
// No query fires until .get(), .first(), or .getPaginated()`;

const pages = [
  { href: '/docs/query-builder/select', label: 'select()', desc: 'Column selection, exclude(), auto-qualification with joins' },
  { href: '/docs/query-builder/where', label: 'where()', desc: 'All WHERE clause methods: where, orWhere, whereRaw, whereIn, whereNull, whereBetween, ILike' },
  { href: '/docs/query-builder/joins', label: 'Joins', desc: 'INNER, LEFT, RIGHT, FULL OUTER joins and multi-join patterns' },
  { href: '/docs/query-builder/ordering-pagination', label: 'Ordering & Pagination', desc: 'orderBy, limit, offset, paginate, getPaginated, first' },
  { href: '/docs/query-builder/preloads', label: 'Preloads', desc: 'Eager loading relations without N+1, nested preloads, cycle detection' },
  { href: '/docs/query-builder/aggregates', label: 'Aggregates', desc: 'countAggregate, sum, avg, min, max, groupBy, having, distinct, window functions' },
  { href: '/docs/query-builder/subqueries', label: 'Subqueries', desc: 'selectSubquery, exists, notExists, whereRaw subqueries, UNION / UNION ALL' },
  { href: '/docs/query-builder/relation-traversal', label: 'Relation Traversal', desc: 'throughRelation, whereRelated, relatedTo — filter across relations without manual SQL' },
  { href: '/docs/query-builder/scopes', label: 'Scopes & ExtendedQueryBuilder', desc: 'scope(), ExtendedQueryBuilder full method inheritance, composable query fragments, Validator class' },
];

export default function QueryBuilderIndexPage() {
  return (
    <DocLayout>
      <h1 style={{ marginBottom: '0.5rem' }}>Query Builder</h1>
      <p style={{ marginBottom: '2rem', fontSize: '1.05rem' }}>
        SlintORM&apos;s fluent query builder covers everything from simple filters to window functions,
        correlated subqueries, and automatic relation-graph traversal. All methods are chainable.
        No query fires until a terminal method (<code>get</code>, <code>first</code>, <code>getPaginated</code>) is called.
      </p>

      {/* Sub-page index */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem', marginBottom: '3rem' }}>
        {pages.map(p => (
          <Link key={p.href} href={p.href} style={{
            display: 'block',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            padding: '1rem 1.25rem',
            textDecoration: 'none',
            transition: 'border-color 150ms',
          }}
          onMouseEnter={undefined}
          >
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--color-accent)', marginBottom: '0.35rem' }}>{p.label}</div>
            <div style={{ fontSize: '0.825rem', color: 'var(--color-fg-subtle)', lineHeight: 1.5 }}>{p.desc}</div>
          </Link>
        ))}
      </div>

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Builder entry points</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        Call one of four methods on any model to get a builder. Each returns a different class
        with its own set of additional methods on top of the base <code>QueryBuilder&lt;T&gt;</code>.
      </p>
      <CodeBlock code={entryPoints} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Terminal methods: get() / first() / getPaginated()</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        These three methods execute the accumulated query and return results.
        All other methods accumulate clauses without hitting the database.
      </p>
      <CodeBlock code={terminalMethods} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Chaining</h2>
      <CodeBlock code={builderChaining} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Dialects — per-driver SQL output</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        The query builder automatically adapts placeholder style, identifier quoting, upsert syntax,
        and ILIKE support to the configured driver. You write the same builder code regardless of database.
      </p>
      <CodeBlock code={dialectSQL} />
    </DocLayout>
  );
}
