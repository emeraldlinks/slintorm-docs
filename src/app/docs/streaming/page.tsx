import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';

export const metadata = {
  title: 'Rows Streaming — SlintORM',
  description: "SlintORM streaming — process large result sets with async iterators, batch by batch, without loading everything into memory.",
  alternates: { canonical: '/docs/streaming' },
};

const streamBasic = `// .stream(batchSize?) — returns AsyncIterator<EntityWithUpdate<T>[]>

const iterator = User.query().stream(10);

for await (const batch of iterator) {
  // batch is User[] — at most 10 rows per iteration
  for (const user of batch) {
    console.log(user.id, user.name);
  }
}

// Default batch size is 100 if omitted
const allUsers = User.query().stream(); // batches of 100`;

const streamFilters = `// Combine with filters, ordering, and all builder methods

const iterator = User.query()
  .where('role', '=', 'admin')
  .where('active', '=', true)
  .orderBy('createdAt', 'ASC')
  .stream(50);

for await (const batch of iterator) {
  for (const user of batch) {
    await sendWelcomeBackEmail(user);
  }
}`;

const streamMemory = `// Memory-efficient processing of large datasets

// ❌ Loads EVERYTHING into memory — dangerous for large tables
const all = await User.getAll();
for (const user of all) {
  await processUser(user);
}

// ✅ Streams in batches — constant memory usage
for await (const batch of User.query().stream(100)) {
  for (const user of batch) {
    await processUser(user);
  }
}

// Useful for:
//   - Data exports (CSV, JSON)
//   - Migrations on large tables
//   - Back-filling computed columns
//   - Sending bulk notifications`;

const streamErrorHandling = `// Error handling in streams

try {
  for await (const batch of User.query().stream(50)) {
    for (const user of batch) {
      await fragileOperation(user);
    }
  }
} catch (err) {
  console.error('Stream processing failed:', err);
  // The stream is aborted — partial results may have been processed
}

// Per-batch error handling with partial recovery
for await (const batch of User.query().stream(50)) {
  const results = await Promise.allSettled(
    batch.map(u => fragileOperation(u))
  );
  const failures = results.filter(r => r.status === 'rejected');
  if (failures.length > 0) {
    console.warn(\`\${failures.length} items failed in this batch\`);
  }
}`;

const streamDriverNotes = `// Driver support

// SQLite    — ✅ supported (uses LIMIT / OFFSET)
// Postgres  — ✅ supported (uses LIMIT / OFFSET)
// MySQL     — ✅ supported (uses LIMIT / OFFSET)
// MongoDB   — ⚠️ supported (uses skip() / limit())
//             Batches are cursor-based, not snapshot-isolated.
//             Documents inserted mid-stream may be missed or duplicated.

// Note: Streams execute N+1 queries (one per batch). Each batch is
// a separate SQL query with increasing OFFSET. For true server-side
// cursors, use driver-native streaming (e.g. pg cursor, MySQL streaming).`;

export default function StreamingPage() {
  return (
    <DocLayout>
      <h1 style={{ marginBottom: '0.5rem' }}>Rows Streaming</h1>
      <p style={{ marginBottom: '2rem', fontSize: '1.05rem' }}>
        Process large result sets without loading everything into memory.
        SlintORM&apos;s <code>.stream()</code> method returns an <code>AsyncIterator</code> that yields batches of entities.
      </p>

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Basic streaming with .stream()</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        Call <code>.stream(batchSize)</code> on any query builder to get an async iterator.
        Each iteration yields an array of up to <code>batchSize</code> entities.
      </p>
      <CodeBlock code={streamBasic} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Combining with filters and ordering</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        All query builder methods — <code>where</code>, <code>orderBy</code>, <code>select</code>, <code>join</code> — work before <code>.stream()</code>.
      </p>
      <CodeBlock code={streamFilters} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Memory-efficient processing</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        <code>.stream()</code> uses <code>LIMIT</code> / <code>OFFSET</code> under the hood, fetching one batch at a time.
        This keeps memory usage constant regardless of table size.
      </p>
      <CodeBlock code={streamMemory} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Error handling</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        Wrap the <code>for await...of</code> loop in try/catch, or handle errors per-batch with <code>Promise.allSettled</code> for partial recovery.
      </p>
      <CodeBlock code={streamErrorHandling} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Driver support</h2>
      <CodeBlock code={streamDriverNotes} />
    </DocLayout>
  );
}
