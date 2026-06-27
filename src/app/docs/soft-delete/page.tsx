import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';

export const metadata = { title: 'Soft Delete — SlintORM' };

const modelDef = `// Mark deletedAt with @softDelete
interface User {
  id: number;
  email: string;
  name: string;
  // @softDelete
  deletedAt: string;   // added automatically to the table
}

// Tables without @softDelete are unaffected — no extra column`;

const autoFilter = `// Default behavior: WHERE deletedAt IS NULL is injected on every query

const users = await User.getAll();
// SELECT * FROM users WHERE deletedAt IS NULL

const user = await User.get({ email: 'joe@example.com' });
// WHERE email = 'joe@example.com' AND deletedAt IS NULL`;

const softDeleteOp = `// .delete() on a soft-delete model sets deletedAt, not removes the row
await User.delete({ id: 42 });
// UPDATE users SET deletedAt = '2024-01-15T10:30:00Z' WHERE id = 42

// The row is now invisible to all standard queries
const user = await User.get({ id: 42 }); // null`;

const withTrashed = `// .withTrashed() — include soft-deleted rows
const allUsers = await User.softDelete()
  .withTrashed()
  .get();
// SELECT * FROM users (no deletedAt filter)

// Combine with other clauses
const suspendedAdmins = await User.softDelete()
  .withTrashed()
  .where('role', '=', 'admin')
  .get();`;

const onlyTrashed = `// .onlyTrashed() — return only soft-deleted rows
const deleted = await User.softDelete()
  .onlyTrashed()
  .get();
// SELECT * FROM users WHERE deletedAt IS NOT NULL`;

const restore = `// .restore(filter) — un-delete: sets deletedAt = NULL
await User.restore({ id: 42 });
// UPDATE users SET deletedAt = NULL WHERE id = 42

// User is now visible in standard queries again
const user = await User.get({ id: 42 }); // found`;

const hardDelete = `// To permanently remove a soft-delete row,
// use the query builder with whereRaw to bypass the auto-filter

await User.softDelete()
  .withTrashed()
  .where('id', '=', 42)
  // No direct hardDelete method — use deleteMany after withTrashed
  // or use orm.adapter.exec() for raw DELETE`;

export default function SoftDeletePage() {
  return (
    <DocLayout>
      <h1 style={{ marginBottom: '0.5rem' }}>Soft Delete</h1>
      <p style={{ marginBottom: '2rem', fontSize: '1.05rem' }}>
        Annotate a <code>deletedAt</code> field with <code>@softDelete</code> and SlintORM automatically
        injects <code>WHERE deletedAt IS NULL</code> on every query for that model.
        Calling <code>.delete()</code> sets the timestamp instead of removing the row.
      </p>

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Model setup</h2>
      <CodeBlock code={modelDef} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Auto-filter on all queries</h2>
      <CodeBlock code={autoFilter} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Soft delete operation</h2>
      <CodeBlock code={softDeleteOp} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>withTrashed</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        Access via <code>model.softDelete()</code> which returns a <code>SoftDeleteQueryBuilder&lt;T&gt;</code>.
      </p>
      <CodeBlock code={withTrashed} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>onlyTrashed</h2>
      <CodeBlock code={onlyTrashed} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>restore</h2>
      <CodeBlock code={restore} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Hard delete note</h2>
      <CodeBlock code={hardDelete} />

      <div style={{
        background: 'rgba(34, 197, 94, 0.08)',
        border: '1px solid rgba(34, 197, 94, 0.2)',
        borderRadius: '8px',
        padding: '1rem 1.25rem',
        marginTop: '2rem',
        fontSize: '0.875rem',
      }}>
        <strong style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-mono)' }}>Clean tables stay clean</strong>
        <p style={{ marginTop: '0.25rem', color: 'var(--color-fg-muted)' }}>
          The <code>deletedAt</code> column is only added to tables whose model has a field annotated
          with <code>@softDelete</code>. Models without this annotation are not affected in any way.
          Migration is non-destructive: existing data is preserved.
        </p>
      </div>
    </DocLayout>
  );
}
