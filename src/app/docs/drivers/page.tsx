import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';

export const metadata = { title: 'Drivers — SlintORM' };

const sqliteSetup = `// SQLite — better-sqlite3 (recommended)
// WAL mode enabled automatically for better concurrency
// Synchronous driver wrapped in async interface

import ORMManager from 'slintorm';

const orm = new ORMManager({
  driver: 'sqlite',
  databaseUrl: './dev.db',    // file path
});

// In-memory database (tests / ephemeral):
const memOrm = new ORMManager({
  driver: 'sqlite',
  databaseUrl: ':memory:',
});

// Fallback: if better-sqlite3 is not installed,
// SlintORM automatically falls back to sqlite3/sqlite (async)`;

const pgSetup = `// PostgreSQL — pg
// Uses $1-style positional placeholders
// RETURNING * on INSERT to get the full row back

import ORMManager from 'slintorm';

const orm = new ORMManager({
  driver: 'postgres',
  databaseUrl: process.env.DATABASE_URL!,
  // postgresql://user:password@host:5432/database
  // postgresql://user:password@host:5432/database?sslmode=require
});`;

const mysqlSetup = `// MySQL — mysql2/promise
// Backtick quoting for identifiers
// ON DUPLICATE KEY UPDATE for upsert

import ORMManager from 'slintorm';

const orm = new ORMManager({
  driver: 'mysql',
  databaseUrl: 'mysql://user:password@localhost:3306/mydb',
});`;

const mongoSetup = `// MongoDB — uses a JSON command protocol
// Each query is translated to find/insert/update/delete/count
// DDL is a no-op (MongoDB is schemaless)
// Note: no transaction support, no UNION, limited JOIN support

import ORMManager from 'slintorm';

const orm = new ORMManager({
  driver: 'mongodb',
  databaseUrl: process.env.MONGO_URI!,
  // mongodb://user:pass@host:27017/mydb
  // mongodb+srv://user:pass@cluster.mongodb.net/mydb
});`;

const preparedStmt = `// Prepared statement cache (SQLite only)
// DBAdapter caches up to 200 prepared statements
// Statements are keyed by SQL string — reused on repeat calls

// Example: repeated queries reuse the same prepared statement
for (const id of userIds) {
  await User.get({ id });  // same SQL pattern -> cached statement
}`;

const closeConn = `// DBAdapter.close() — clean connection teardown
// Call when shutting down (e.g. SIGTERM handler, test teardown)

import ORMManager from 'slintorm';
const orm = new ORMManager({ ... });
// ... use orm ...

process.on('SIGTERM', async () => {
  await orm.adapter.close();
  process.exit(0);
});`;

const tableInfo = `// DBAdapter.getTableInfo(table)
// Introspects the column list for an existing table
// Per-driver implementation:
//   SQLite:   PRAGMA table_info(tableName)
//   Postgres: information_schema.columns
//   MySQL:    information_schema.columns
//   MongoDB:  returns empty (schemaless)

const columns = await orm.adapter.getTableInfo('users');
// [{ name: 'id', type: 'INTEGER', ... }, ...]`;

const driverFeatures = [
  { feature: 'Prepared statement cache', sqlite: '✓ (200 max)', pg: '—', mysql: '—', mongo: '—' },
  { feature: 'WAL mode', sqlite: '✓ (auto)', pg: '—', mysql: '—', mongo: '—' },
  { feature: 'RETURNING * on INSERT', sqlite: '✓', pg: '✓', mysql: '—', mongo: '—' },
  { feature: 'ON CONFLICT (upsert)', sqlite: '✓', pg: '✓', mysql: '— (ON DUPLICATE KEY)', mongo: '—' },
  { feature: 'FULL OUTER JOIN', sqlite: '—', pg: '✓', mysql: '—', mongo: '—' },
  { feature: 'Transactions', sqlite: '✓', pg: '✓', mysql: '✓', mongo: '—' },
  { feature: 'Window functions', sqlite: '✓ (limited)', pg: '✓', mysql: '✓', mongo: '—' },
  { feature: 'IN-memory mode', sqlite: '✓ (:memory:)', pg: '—', mysql: '—', mongo: '—' },
];

export default function DriversPage() {
  return (
    <DocLayout>
      <h1 style={{ marginBottom: '0.5rem' }}>Drivers</h1>
      <p style={{ marginBottom: '2rem', fontSize: '1.05rem' }}>
        SlintORM's <code>DBAdapter</code> abstracts across four database drivers.
        Each driver handles query placeholders, DDL syntax, and error codes differently.
        The adapter normalizes these differences behind a single <code>exec()</code> interface.
      </p>

      <h2 style={{ marginBottom: '1rem', marginTop: '2rem' }}>Feature matrix</h2>
      <div style={{ border: '1px solid var(--color-border)', borderRadius: '10px', overflow: 'hidden', marginBottom: '2.5rem' }}>
        <table>
          <thead>
            <tr>
              <th>Feature</th>
              <th>SQLite</th>
              <th>Postgres</th>
              <th>MySQL</th>
              <th>MongoDB</th>
            </tr>
          </thead>
          <tbody>
            {driverFeatures.map(r => (
              <tr key={r.feature}>
                <td>{r.feature}</td>
                <td style={{ color: r.sqlite.startsWith('✓') ? 'var(--color-accent)' : 'var(--color-fg-subtle)', fontSize: '0.85rem' }}>{r.sqlite}</td>
                <td style={{ color: r.pg.startsWith('✓') ? 'var(--color-accent)' : 'var(--color-fg-subtle)', fontSize: '0.85rem' }}>{r.pg}</td>
                <td style={{ color: r.mysql.startsWith('✓') ? 'var(--color-accent)' : 'var(--color-fg-subtle)', fontSize: '0.85rem' }}>{r.mysql}</td>
                <td style={{ color: r.mongo.startsWith('✓') ? 'var(--color-accent)' : 'var(--color-fg-subtle)', fontSize: '0.85rem' }}>{r.mongo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>SQLite</h2>
      <CodeBlock code={sqliteSetup} filename="db.ts" />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>PostgreSQL</h2>
      <CodeBlock code={pgSetup} filename="db.ts" />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>MySQL</h2>
      <CodeBlock code={mysqlSetup} filename="db.ts" />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>MongoDB</h2>
      <CodeBlock code={mongoSetup} filename="db.ts" />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Prepared statement cache</h2>
      <CodeBlock code={preparedStmt} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Connection teardown</h2>
      <CodeBlock code={closeConn} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Table introspection</h2>
      <CodeBlock code={tableInfo} />
    </DocLayout>
  );
}
