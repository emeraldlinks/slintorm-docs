import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';

export const metadata = {
  title: 'Error Handling — SlintORM',
  description: "SlintORM error handling — ORMError, all 5 ORMErrorCode values, per-driver constraint parsing.",
  alternates: { canonical: '/docs/error-handling' },
};

const catchOrmError = `// Import ORMError and ORMErrorCode
import { ORMError, ORMErrorCode } from 'slintorm';

try {
  await User.insert({ email: 'duplicate@example.com', name: 'Alice' });
} catch (err) {
  if (err instanceof ORMError) {
    switch (err.ormCode) {
      case ORMErrorCode.UNIQUE_VIOLATION:
        console.log(\`Duplicate value on column: \${err.column}\`);
        break;
      case ORMErrorCode.NOT_NULL_VIOLATION:
        console.log(\`Required column missing: \${err.column}\`);
        break;
      case ORMErrorCode.FOREIGN_KEY_VIOLATION:
        console.log(\`Foreign key broken: \${err.column}\`);
        break;
      case ORMErrorCode.CHECK_VIOLATION:
        console.log(\`Check constraint failed: \${err.column}\`);
        break;
      case ORMErrorCode.UNKNOWN_CONSTRAINT:
        console.log('Unknown constraint error:', err.message);
        break;
    }
  }
}`;

const ormErrorProps = `// ORMError properties

err.ormCode     // ORMErrorCode — one of the 5 codes below
err.table       // string | undefined — the affected table
err.column      // string | undefined — the affected column
err.value       // unknown — the value that caused the violation
err.sql         // string | undefined — the SQL that was executed
err.params      // unknown[] | undefined — bound parameters
err.message     // string — human-readable error message
err.original    // unknown — the original driver error (raw pg/mysql2/sqlite3 error)`;

const errorCodes = `// ORMErrorCode values

ORMErrorCode.UNIQUE_VIOLATION         // Duplicate value in a UNIQUE or PRIMARY KEY column
ORMErrorCode.NOT_NULL_VIOLATION       // NULL inserted into a NOT NULL column
ORMErrorCode.FOREIGN_KEY_VIOLATION    // References a non-existent foreign key
ORMErrorCode.CHECK_VIOLATION          // Value failed a CHECK constraint or ENUM restriction
ORMErrorCode.UNKNOWN_CONSTRAINT       // Constraint error that doesn't match the known patterns`;

const driverMapping = `// Per-driver error parsing (done automatically by wrapExec)

// SQLite — detects by errno 19 (SQLITE_CONSTRAINT) and message parsing
//   UNIQUE_VIOLATION    -> "UNIQUE constraint failed: table.column"
//   NOT_NULL_VIOLATION  -> "NOT NULL constraint failed: table.column"
//   FOREIGN_KEY_VIOLATION -> "FOREIGN KEY constraint failed"
//   CHECK_VIOLATION     -> "CHECK constraint failed: ..."

// PostgreSQL — detects by pgError code
//   23505 -> UNIQUE_VIOLATION
//   23502 -> NOT_NULL_VIOLATION
//   23503 -> FOREIGN_KEY_VIOLATION
//   23514 -> CHECK_VIOLATION

// MySQL — detects by mysql error code string
//   ER_DUP_ENTRY           -> UNIQUE_VIOLATION
//   ER_BAD_NULL_ERROR      -> NOT_NULL_VIOLATION
//   ER_NO_REFERENCED_ROW_2 -> FOREIGN_KEY_VIOLATION
//   ER_CHECK_CONSTRAINT_VIOLATED -> CHECK_VIOLATION`;

const inApiRoute = `// Handling ORMError in a Next.js API route
import { NextRequest, NextResponse } from 'next/server';
import { ORMError, ORMErrorCode } from 'slintorm';
import { User } from '@/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const user = await User.insert(body);
    return NextResponse.json({ id: user.id }, { status: 201 });
  } catch (err) {
    if (err instanceof ORMError) {
      if (err.ormCode === ORMErrorCode.UNIQUE_VIOLATION) {
        return NextResponse.json(
          { error: 'Email already registered' },
          { status: 409 }
        );
      }
      if (err.ormCode === ORMErrorCode.NOT_NULL_VIOLATION) {
        return NextResponse.json(
          { error: \`Missing required field: \${err.column}\` },
          { status: 400 }
        );
      }
    }
    throw err; // re-throw unexpected errors
  }
}`;

const codes = [
  { code: 'UNIQUE_VIOLATION', desc: 'Duplicate value in a UNIQUE or PRIMARY KEY column', sqlite: 'UNIQUE constraint failed', pg: '23505', mysql: 'ER_DUP_ENTRY' },
  { code: 'NOT_NULL_VIOLATION', desc: 'NULL inserted into a NOT NULL column', sqlite: 'NOT NULL constraint failed', pg: '23502', mysql: 'ER_BAD_NULL_ERROR' },
  { code: 'FOREIGN_KEY_VIOLATION', desc: 'References a non-existent row in another table', sqlite: 'FOREIGN KEY constraint failed', pg: '23503', mysql: 'ER_NO_REFERENCED_ROW_2' },
  { code: 'CHECK_VIOLATION', desc: 'Value failed a CHECK constraint or ENUM restriction', sqlite: 'CHECK constraint failed', pg: '23514', mysql: 'ER_CHECK_CONSTRAINT_VIOLATED' },
  { code: 'UNKNOWN_CONSTRAINT', desc: 'Constraint error not matching any known pattern', sqlite: '—', pg: '—', mysql: '—' },
];

export default function ErrorHandlingPage() {
  return (
    <DocLayout>
      <h1 style={{ marginBottom: '0.5rem' }}>Error Handling</h1>
      <p style={{ marginBottom: '2rem', fontSize: '1.05rem' }}>
        SlintORM wraps all driver errors into a unified <code>ORMError</code> with a typed <code>ormCode</code>.
        No more parsing raw SQLite errno or Postgres pgError codes per-driver.
      </p>

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Catching ORMError</h2>
      <CodeBlock code={catchOrmError} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>ORMError properties</h2>
      <CodeBlock code={ormErrorProps} />

      <h2 style={{ marginBottom: '1rem', marginTop: '2.5rem' }}>ORMErrorCode values</h2>
      <div style={{ border: '1px solid var(--color-border)', borderRadius: '10px', overflow: 'hidden', marginBottom: '2rem' }}>
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Description</th>
              <th>SQLite</th>
              <th>Postgres</th>
              <th>MySQL</th>
            </tr>
          </thead>
          <tbody>
            {codes.map(c => (
              <tr key={c.code}>
                <td><code style={{ fontSize: '0.8rem' }}>{c.code}</code></td>
                <td style={{ color: 'var(--color-fg-subtle)', fontSize: '0.85rem' }}>{c.desc}</td>
                <td style={{ color: 'var(--color-fg-subtle)', fontSize: '0.8rem' }}>{c.sqlite}</td>
                <td style={{ color: 'var(--color-fg-subtle)', fontSize: '0.8rem' }}>{c.pg}</td>
                <td style={{ color: 'var(--color-fg-subtle)', fontSize: '0.8rem' }}>{c.mysql}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Error codes (raw)</h2>
      <CodeBlock code={errorCodes} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Per-driver parsing</h2>
      <CodeBlock code={driverMapping} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>In a Next.js API route</h2>
      <CodeBlock code={inApiRoute} filename="app/api/users/route.ts" />
    </DocLayout>
  );
}
