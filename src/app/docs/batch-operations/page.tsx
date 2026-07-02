import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';

export const metadata = {
  title: 'Batch Operations — SlintORM',
  description: 'SlintORM batch operations — insertMany, updateMany, deleteMany, findInBatches, truncate.',
  alternates: { canonical: '/docs/batch-operations' },
};

const insertManyCode = `// insertMany(items[]) — returns number of rows inserted
// SQLite wraps all inserts in a single transaction for performance
// Postgres/MySQL use batch INSERT statements

const count = await User.insertMany([
  { email: 'alice@example.com', name: 'Alice', role: 'user' },
  { email: 'bob@example.com', name: 'Bob', role: 'user' },
  { email: 'carol@example.com', name: 'Carol', role: 'admin' },
]);

console.log(count); // 3

// On Postgres, each row is returned with auto-generated fields:
// const users = await User.insertMany([...]);
// users[0].id, users[0].createdAt, etc. are all populated.`;

const insertManyLarge = `// Large batch — consider chunking for very large arrays
const batchSize = 500;
const allRecords = []; // imagine 10,000 items

for (let i = 0; i < allRecords.length; i += batchSize) {
  const chunk = allRecords.slice(i, i + batchSize);
  const inserted = await User.insertMany(chunk);
  console.log(\`Inserted \${inserted} users (batch \${i / batchSize + 1})\`);
}`;

const updateManyCode = `// updateMany(filter, data) — returns number of affected rows
// Sets updatedAt automatically

const count = await User.updateMany(
  { role: 'guest' },
  { role: 'user' }
);

console.log(\`Upgraded \${count} guests to users\`);

// Can update multiple fields at once
await Post.updateMany(
  { status: 'draft', authorId: null },
  { status: 'archived', archivedAt: new Date().toISOString() }
);`;

const deleteManyCode = `// deleteMany(filter) — returns number of deleted rows
// WARNING: omitting filter or passing {} may be restricted depending on driver

const count = await Session.deleteMany({
  expiresAt: { $lt: new Date().toISOString() }
});

console.log(\`Cleaned up \${count} expired sessions\`);

// Soft-delete models: deleteMany performs a logical delete
// (sets deletedAt), not a physical removal`;

const findInBatchesCode = `// findInBatches(filter, batchSize, callback) — processes records
// in manageable chunks to avoid memory spikes

await User.findInBatches(
  { role: 'user' },
  100,  // batch size
  (batch, batchNumber) => {
    console.log(\`Processing batch \${batchNumber} (\${batch.length} users)\`);

    for (const user of batch) {
      // Each user is a full EntityWithUpdate<T>
      // Process without loading all records into memory at once
    }
  }
);

// The callback can be async
await User.findInBatches(
  { active: true },
  50,
  async (batch, batchNumber) => {
    for (const user of batch) {
      await user.update({ notifiedAt: new Date().toISOString() });
    }
    console.log(\`Batch \${batchNumber} complete\`);
  }
);`;

const truncateCode = `// truncate() — deletes ALL rows. Irreversible.
// Resets auto-increment counters on most databases.

await TempSession.truncate();

console.log('All temporary sessions removed');

// On SQLite: DELETE FROM table (no transaction wrap)
// On Postgres: TRUNCATE table RESTART IDENTITY
// On MySQL: TRUNCATE table
// On MongoDB: deleteMany({})`;

const performanceTips = `// Performance tips for batch operations:

// 1. SQLite — insertMany wraps in a transaction automatically.
//    Avoid manual transaction wrapping around insertMany.

// 2. Postgres — insertMany uses multi-row INSERT:
//    INSERT INTO users (email, name) VALUES ($1,$2),($3,$4),...

// 3. deleteMany with large datasets — consider findInBatches
//    + individual delete if you need per-row hooks.

// 4. MongoDB — insertMany uses insertMany(), deleteMany uses
//    deleteMany(). No transaction support.

// 5. Always prefer batch methods over loop + individual calls
//    for bulk operations — they are 10-100x faster.`;

export default function BatchOperationsPage() {
  return (
    <DocLayout>
      <h1 style={{ marginBottom: '0.5rem' }}>Batch Operations</h1>
      <p style={{ marginBottom: '2rem', fontSize: '1.05rem' }}>
        SlintORM provides batch methods for efficiently operating on multiple
        rows at once. These methods are significantly faster than looping over
        individual <code>.insert()</code>, <code>.update()</code>, or{' '}
        <code>.delete()</code> calls.
      </p>

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>insertMany</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        <code>insertMany(items[])</code> performs a batch insert and returns
        the number of rows inserted. On SQLite the operation is wrapped in a
        single transaction. On Postgres each inserted row is returned with
        auto-generated field values.
      </p>
      <CodeBlock code={insertManyCode} />

      <h3 style={{ marginBottom: '0.75rem', marginTop: '1.5rem' }}>Chunking large datasets</h3>
      <CodeBlock code={insertManyLarge} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>updateMany</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        <code>updateMany(filter, data)</code> updates all rows matching the
        filter and returns the number of affected rows. The{' '}
        <code>updatedAt</code> field is set automatically.
      </p>
      <CodeBlock code={updateManyCode} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>deleteMany</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        <code>deleteMany(filter)</code> deletes all rows matching the filter
        and returns the count. On models with soft-delete enabled, this
        performs a logical delete instead of a physical removal.
      </p>
      <CodeBlock code={deleteManyCode} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>findInBatches</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        <code>findInBatches(filter, batchSize, callback)</code> processes
        records in manageable chunks to avoid loading the entire result set
        into memory. The callback receives{' '}
        <code>(batch: EntityWithUpdate&lt;T&gt;[], batchNumber: number)</code>.
      </p>
      <CodeBlock code={findInBatchesCode} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>truncate</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        <code>truncate()</code> removes all rows from the table and resets
        auto-increment counters. Use with extreme caution — this operation is
        not reversible.
      </p>
      <CodeBlock code={truncateCode} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Performance tips</h2>
      <CodeBlock code={performanceTips} />
    </DocLayout>
  );
}
