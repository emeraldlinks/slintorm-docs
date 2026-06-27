import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';

export const metadata = { title: 'Migrations — SlintORM' };

const migrate = `// orm.migrate() — reads TypeScript source files,
// generates schema, diffs against current DB state, applies DDL

import { createORM } from 'slintorm';
const orm = createORM({ driver: 'sqlite', databaseUrl: './dev.db', dir: './src' });

// Run once on startup or in a migration script
await orm.migrate();
// -> scans ./src for interface definitions
// -> generates schema/generated.ts + schema/generated.json
// -> creates/alters tables as needed`;

const autoColumns = `// Columns injected automatically on every table:
// createdAt TEXT  — set on INSERT
// updatedAt TEXT  — set on INSERT and UPDATE

// deletedAt TEXT  — ONLY when a field has @softDelete
// (tables without @softDelete get no extra column)`;

const alterTable = `// Alter table — non-destructive
// Adding a field to an interface adds the column
// Removing a field from an interface removes the column

// Before:
interface User {
  id: number;
  email: string;
  name: string;
}

// After (add bio, remove name):
interface User {
  id: number;
  email: string;
  // @nullable
  bio: string;
}

// migrate() runs:
// ALTER TABLE users ADD COLUMN bio TEXT
// ALTER TABLE users DROP COLUMN name  (Postgres/MySQL)
// On SQLite: recreate table (limitations apply)`;

const trackingTable = `// _slint_migrations table — created automatically

-- SQLite / MySQL schema:
CREATE TABLE IF NOT EXISTS _slint_migrations (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  name      TEXT NOT NULL,
  batch     INTEGER NOT NULL,
  hash      TEXT NOT NULL,
  snapshot  TEXT,
  migratedAt TEXT NOT NULL
);

-- Postgres schema:
CREATE TABLE IF NOT EXISTS _slint_migrations (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  batch      INTEGER NOT NULL,
  hash       TEXT NOT NULL,
  snapshot   TEXT,
  migratedAt TEXT NOT NULL
);`;

const hooks = `// MigrationRunHooks — observe migration progress
await orm.migrate({
  onPending(units) {
    console.log(\`\${units.length} migrations pending\`);
  },
  onProgress(unit) {
    console.log(\`Running: \${unit.name}\`);
  },
  onDone(result) {
    console.log(\`Done. \${result.ran} migrations applied.\`);
  },
  onError(unit, err) {
    console.error(\`Failed: \${unit.name}\`, err);
  },
});`;

const snapshots = `// Schema snapshots
// Saved to: src/schema/migrations/_schema_snapshots/batch-N/
// Each batch captures a JSON snapshot of all model schemas at that point

// hashSchemaModel — SHA-256 of stable JSON
// If the hash matches the last recorded hash, no migration runs for that model
// Change an interface -> hash changes -> migration runs`;

const migrationUnit = `// MigrationUnit — represents one pending migration
interface MigrationUnit {
  name: string;      // model/table name
  hash: string;      // SHA-256 of schema JSON
  sql: string[];     // DDL statements to execute
  batch: number;     // batch number
}

// MigrationRunResult — returned by orm.migrate()
interface MigrationRunResult {
  ran: number;       // number of migrations applied
  skipped: number;   // number skipped (hash matched)
  batch: number;     // batch number used
}`;

export default function MigrationsPage() {
  return (
    <DocLayout>
      <h1 style={{ marginBottom: '0.5rem' }}>Migrations</h1>
      <p style={{ marginBottom: '2rem', fontSize: '1.05rem' }}>
        <code>orm.migrate()</code> reads your TypeScript interface files, generates a schema,
        diffs it against the current database, and applies the minimal set of DDL statements needed.
        No separate migration files to write.
      </p>

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>orm.migrate()</h2>
      <CodeBlock code={migrate} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Auto-injected columns</h2>
      <CodeBlock code={autoColumns} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Alter table (non-destructive)</h2>
      <CodeBlock code={alterTable} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>_slint_migrations tracking table</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        SlintORM creates this table automatically. Each row records a migration batch, model name, and a SHA-256 hash.
        If the hash hasn't changed, that model's migration is skipped.
      </p>
      <CodeBlock code={trackingTable} language="sql" />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Migration hooks</h2>
      <CodeBlock code={hooks} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Schema snapshots</h2>
      <CodeBlock code={snapshots} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>MigrationUnit / MigrationRunResult types</h2>
      <CodeBlock code={migrationUnit} />

      <div style={{
        background: 'rgba(245, 158, 11, 0.08)',
        border: '1px solid rgba(245, 158, 11, 0.25)',
        borderRadius: '8px',
        padding: '1rem 1.25rem',
        marginTop: '2rem',
        fontSize: '0.875rem',
      }}>
        <strong style={{ color: '#F59E0B', fontFamily: 'var(--font-mono)' }}>Snapshot-based architecture</strong>
        <p style={{ marginTop: '0.25rem', color: 'var(--color-fg-muted)' }}>
          The migration system records field snapshots (not step-based diffs). This means if you change an
          existing model field&apos;s type or constraints without running <code>fresh</code>, the change may be silently
          skipped if the hash still matches. Use <code>npx slintorm fresh</code> to reset and re-run all migrations in development.
        </p>
      </div>
    </DocLayout>
  );
}
