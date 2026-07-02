import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';

export const metadata = {
  title: 'Raw SQL & SqlExpr — SlintORM',
  description: "SlintORM raw SQL support — SqlExpr for embedding SQL expressions in queries, raw WHERE clauses.",
  alternates: { canonical: '/docs/raw-sql' },
};

const sqlExprRaw = `// SqlExpr.raw(sql, params?) — embed arbitrary SQL in field values

import { SqlExpr } from 'slintorm';

// In inserts — pass raw SQL expressions as values
await User.insert({
  name: SqlExpr.raw("'ExprUser'"),
  createdAt: SqlExpr.raw("datetime('now')"),
});

// In updates — increment counters or use SQL functions
await User.update(
  { id: 42 },
  {
    loginCount: SqlExpr.raw('login_count + 1'),
    lastLoginAt: SqlExpr.raw("datetime('now')"),
  }
);

// SqlExpr.raw is not escaped — see security notes below`;

const whereRawCode = `// whereRaw(sql, params?) — raw SQL in WHERE clauses

const users = await User.query()
  .whereRaw('createdAt > datetime("now", "-7 days")')
  .get();

// With positional params (SQLite / MySQL)
const recent = await User.query()
  .whereRaw('createdAt > ?', ['2024-01-01'])
  .get();

// With numbered params (Postgres — auto-detected by driver)
const flagged = await User.query()
  .whereRaw('email LIKE $1 OR name LIKE $2', ['%@example.com', '%test%'])
  .get();

// Combine with regular builder methods
const result = await User.query()
  .where('active', '=', true)
  .whereRaw('LENGTH(bio) > ?', [100])
  .orderBy('createdAt', 'DESC')
  .get();`;

const namedWhereCode = `// namedWhere(sql, params) — named placeholders for readability

const users = await User.query()
  .namedWhere(
    'createdAt > :since AND role = :role',
    { since: '2024-06-01', role: 'admin' }
  )
  .get();

// Named params can be mixed with regular where() calls
const result = await User.query()
  .where('active', '=', true)
  .namedWhere('updatedAt > :date', { date: '2024-01-01' })
  .get();`;

const securityNotes = `// ⚠️ SQL Injection — you are responsible for escaping

// SAFE: SqlExpr.raw with user-provided values
const input = req.query.sortColumn;  // user-controlled
const users = await User.query()
  .orderBy(SqlExpr.raw(input), 'ASC')
  .get();
// ^^ DANGEROUS — input could be "id; DROP TABLE users;"

// SAFER: validate against an allow-list
const allowed = ['name', 'email', 'createdAt'];
if (!allowed.includes(input)) throw new Error('Invalid sort column');

// SAFE: use parameterised queries instead of raw strings
const email = userInput;
const users = await User.query()
  .where('email', '=', email)   // parameterised — safe
  .get();

// SAFE: SqlExpr.raw with parameterised values
const status = userInput;
const users = await User.query()
  .whereRaw('status = ?', [status])  // param — safe
  .get();

// Rule of thumb: never interpolate user input into raw SQL strings.
// Always pass values through the params array.`;

const driverCompat = `// Driver compatibility

// SqlExpr.raw — all drivers (SQLite, Postgres, MySQL, MongoDB)
//   MongoDB translates SqlExpr.raw to $expr / $where
//   but raw SQL strings passed to whereRaw will NOT work
//   on the MongoDB driver (use $expr or aggregation instead)

// whereRaw — SQLite, Postgres, MySQL
//   Not supported on MongoDB driver

// namedWhere — SQLite, Postgres, MySQL
//   Named placeholders are rewritten to positional/numbered
//   per driver automatically. Not supported on MongoDB.`;

export default function RawSqlPage() {
  return (
    <DocLayout>
      <h1 style={{ marginBottom: '0.5rem' }}>Raw SQL &amp; SqlExpr</h1>
      <p style={{ marginBottom: '2rem', fontSize: '1.05rem' }}>
        SlintORM provides escape hatches for raw SQL when the query builder is not enough.
        Use <code>SqlExpr</code> to embed SQL expressions in field values, and <code>whereRaw</code> / <code>namedWhere</code> for raw WHERE clauses.
      </p>

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>SqlExpr — embed raw SQL in field values</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        The <code>SqlExpr</code> class lets you pass arbitrary SQL expressions wherever a field value is expected — inserts, updates, and query builder methods like <code>orderBy</code>.
      </p>
      <CodeBlock code={sqlExprRaw} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>raw WHERE with whereRaw()</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        <code>whereRaw(sql, params?)</code> injects a raw SQL fragment into the WHERE clause. Supports positional (<code>?</code>) and Postgres-style (<code>$1</code>) placeholders.
      </p>
      <CodeBlock code={whereRawCode} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Named placeholders with namedWhere()</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        <code>namedWhere(sql, params)</code> works like <code>whereRaw</code> but uses <code>:name</code> placeholders for readability.
      </p>
      <CodeBlock code={namedWhereCode} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Security — SQL injection</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        Raw expressions bypass SlintORM&apos;s parameterisation. Never interpolate user input directly into SQL strings.
        Always use the params array or stick to builder methods where values are automatically escaped.
      </p>
      <CodeBlock code={securityNotes} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Driver compatibility</h2>
      <CodeBlock code={driverCompat} />
    </DocLayout>
  );
}
