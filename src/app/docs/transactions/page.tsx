import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';

export const metadata = { title: 'Transactions — SlintORM' };

const transactionBasic = `// orm.transaction(async (trx) => { ... })
// BEGIN on entry, COMMIT on success, ROLLBACK on any throw

await orm.transaction(async (trx) => {
  const user = await trx.User.insert({
    email: 'joe@example.com',
    name: 'Joe',
  });

  await trx.Post.insert({
    title: 'First post',
    userId: user.id,
  });

  // If anything throws here, both inserts are rolled back
});`;

const transactionRollback = `// Any thrown error triggers automatic ROLLBACK
try {
  await orm.transaction(async (trx) => {
    await trx.Account.update(
      { id: fromAccountId },
      { balance: fromBalance - amount }
    );

    await trx.Account.update(
      { id: toAccountId },
      { balance: toBalance + amount }
    );

    // If toAccountId doesn't exist, this throws
    // -> ROLLBACK — fromAccount balance is restored
    await trx.Transaction.insert({
      from: fromAccountId,
      to: toAccountId,
      amount,
    });
  });
} catch (err) {
  console.error('Transfer failed, rolled back:', err);
}`;

const batchExec = `// orm.batch(statements) — flat list of SQL statements
// Wrapped in a single transaction
// Each statement: { sql: string, params?: unknown[] }

await orm.batch([
  {
    sql: 'INSERT INTO tags (name) VALUES (?)',
    params: ['typescript'],
  },
  {
    sql: 'INSERT INTO tags (name) VALUES (?)',
    params: ['orm'],
  },
  {
    sql: 'UPDATE posts SET tagCount = tagCount + 2 WHERE id = ?',
    params: [postId],
  },
]);`;

const rawAdapter = `// Raw escape hatch via orm.adapter.exec()
// Use for DDL or statements not covered by the query builder

const result = await orm.adapter.exec(
  'ALTER TABLE users ADD COLUMN lastLoginAt TEXT',
  []
);

// exec returns SQLExecResult:
// { rows: any[], rowsAffected: number, lastInsertId: number | null }`;

const mongoNote = `// MongoDB note
// MongoDB does not support multi-document transactions via orm.transaction()
// in the current implementation — the callback runs without a transaction.
// Use the MongoDB driver's session API directly for atomic multi-document ops.

// orm.batch() is a no-op on MongoDB (documents are atomic individually).`;

export default function TransactionsPage() {
  return (
    <DocLayout>
      <h1 style={{ marginBottom: '0.5rem' }}>Transactions</h1>
      <p style={{ marginBottom: '2rem', fontSize: '1.05rem' }}>
        <code>orm.transaction()</code> wraps an async callback in a database transaction.
        <code>orm.batch()</code> runs a flat list of SQL statements in one transaction.
      </p>

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>orm.transaction()</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        The callback receives a <code>trx</code> object with the same model API as <code>orm.db</code>.
        On success the transaction is committed. Any thrown error triggers automatic rollback.
      </p>
      <CodeBlock code={transactionBasic} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Automatic rollback</h2>
      <CodeBlock code={transactionRollback} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>orm.batch()</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        For bulk operations with raw SQL. All statements execute in a single transaction.
        Useful for seeding, data migrations, or operations outside the model API.
      </p>
      <CodeBlock code={batchExec} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Raw adapter access</h2>
      <CodeBlock code={rawAdapter} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>MongoDB</h2>
      <div style={{
        background: 'rgba(245, 158, 11, 0.08)',
        border: '1px solid rgba(245, 158, 11, 0.25)',
        borderRadius: '8px',
        padding: '1rem 1.25rem',
      }}>
        <CodeBlock code={mongoNote} />
      </div>
    </DocLayout>
  );
}
