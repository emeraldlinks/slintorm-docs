import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';

export const metadata = {
  title: 'Upsert & findOrCreate & firstOrInit — SlintORM',
  description: 'SlintORM upsert, findOrCreate, and firstOrInit methods — conflict-based insert-or-update, find-or-create pattern, and unsaved instance initialization.',
  alternates: { canonical: '/docs/upsert-find-or-create' },
};

const upsertBasic = `// upsert(filter, data) — returns "inserted" | "updated"
// Postgres:  ON CONFLICT (filter columns) DO UPDATE SET ...
// MySQL:     ON DUPLICATE KEY UPDATE ...
// SQLite:    manual get → insert/update
// MongoDB:   manual get → insert/update

const result = await User.upsert(
  { email: 'joe@example.com' },  // filter — conflict columns
  { name: 'Joe', role: 'admin' } // data to insert or update
);

if (result === 'inserted') {
  console.log('New user created');
} else {
  console.log('Existing user updated');
}`;

const upsertMultiField = `// Multi-column conflict key (Postgres)
const result = await Booking.upsert(
  { roomId: 5, date: '2025-12-01' },
  { guestName: 'Alice', status: 'confirmed' }
);
// Generates: ON CONFLICT (roomId, date) DO UPDATE SET ...`;

const upsertReturnEntity = `// With .returning() — get the entity back
const user = await User.upsert(
  { email: 'joe@example.com' },
  { name: 'Joseph' }
).returning();

console.log(user.name); // "Joseph" — full entity with .update(), .delete()`; // eslint-disable-line no-unused-expressions

const findOrCreateBasic = `// findOrCreate(filter, defaults) — returns { record, created }
const { record, created } = await User.findOrCreate(
  { email: 'joe@example.com' },
  { name: 'Joe', role: 'user' }
);

if (created) {
  console.log('Created user:', record.id);
} else {
  console.log('Found existing user:', record.id);
}

// record is a full EntityWithUpdate<T> — can call .update(), .delete()
await record.update({ lastLoginAt: new Date().toISOString() });`;

const findOrCreateNoDefaults = `// Defaults can be omitted if filter already has all required fields
const { record, created } = await User.findOrCreate(
  { email: 'alice@example.com', name: 'Alice', role: 'user' }
);
// Uses the filter object itself as the insert data`;

const findOrCreateTransaction = `// Atomic find-or-create — runs inside a transaction
// (not all drivers support this; falls back to best-effort on SQLite/MongoDB)
const { record, created } = await User.findOrCreate(
  { email: 'rare@example.com' },
  { name: 'Rare', role: 'user' }
);

if (!created) {
  // Another request may have inserted it between our check and insert
  // race condition is handled at the DB level where possible
}`;

const firstOrInitFound = `// firstOrInit(filter, defaults?) — returns record or unsaved instance
// If found: returns the matching entity (persisted)
const user = await User.firstOrInit(
  { email: 'joe@example.com' }
);

if (user.isNew) {
  // Was not found — user is an unsaved instance
  // You can modify it and call .update() to persist
  user.name = 'Joe';
  await user.update();  // inserts the row
} else {
  console.log('Found:', user.name);
}`;

const firstOrInitDefaults = `// With defaults — merges defaults onto the unsaved instance
const user = await User.firstOrInit(
  { email: 'newuser@example.com' },
  { name: 'New User', role: 'user', active: true }
);

console.log(user.name);   // "New User"
console.log(user.role);   // "user"
console.log(user.isNew);  // true — not persisted yet

// Persist it
await user.update();
console.log(user.isNew);  // false — now saved`;

export default function UpsertFindOrCreatePage() {
  return (
    <DocLayout>
      <h1 style={{ marginBottom: '0.5rem' }}>Upsert &amp; findOrCreate &amp; firstOrInit</h1>
      <p style={{ marginBottom: '2rem', fontSize: '1.05rem' }}>
        SlintORM provides three methods for handling the common pattern of
        &ldquo;insert or update&rdquo; logic. Each handles the edge cases of
        race conditions and unsaved instances differently.
      </p>

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>upsert</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        The <code>upsert(filter, data)</code> method inserts a row or updates it
        if a matching row already exists. It returns <code>&quot;inserted&quot;</code> or{' '}
        <code>&quot;updated&quot;</code>. The SQL implementation varies by driver:
        Postgres uses <code>ON CONFLICT</code>, MySQL uses{' '}
        <code>ON DUPLICATE KEY</code>, and SQLite/MongoDB perform a manual
        two-step query.
      </p>
      <CodeBlock code={upsertBasic} />

      <h3 style={{ marginBottom: '0.75rem', marginTop: '1.5rem' }}>Multi-column conflicts</h3>
      <CodeBlock code={upsertMultiField} />

      <h3 style={{ marginBottom: '0.75rem', marginTop: '1.5rem' }}>Returning the entity</h3>
      <p style={{ marginBottom: '0.75rem' }}>
        Chain <code>.returning()</code> to get the full entity back from an
        upsert instead of just the status string.
      </p>
      <CodeBlock code={upsertReturnEntity} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>findOrCreate</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        <code>findOrCreate(filter, defaults?)</code> attempts to find a record
        matching the filter. If none is found, it creates one using the filter
        merged with <code>defaults</code>. Returns{' '}
        <code>{'{ record, created }'}</code> — the record is always a full{' '}
        <code>EntityWithUpdate&lt;T&gt;</code> instance.
      </p>
      <CodeBlock code={findOrCreateBasic} />

      <h3 style={{ marginBottom: '0.75rem', marginTop: '1.5rem' }}>Defaults from filter</h3>
      <CodeBlock code={findOrCreateNoDefaults} />

      <h3 style={{ marginBottom: '0.75rem', marginTop: '1.5rem' }}>Atomicity notes</h3>
      <CodeBlock code={findOrCreateTransaction} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>firstOrInit</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        <code>firstOrInit(filter, defaults?)</code> returns the first matching
        record, or creates an <strong>unsaved</strong> instance (not persisted).
        The returned entity has a <code>isNew</code> property set to{' '}
        <code>true</code> when it has not been saved. Call{' '}
        <code>.update()</code> on it to persist.
      </p>
      <CodeBlock code={firstOrInitFound} />

      <h3 style={{ marginBottom: '0.75rem', marginTop: '1.5rem' }}>With default values</h3>
      <CodeBlock code={firstOrInitDefaults} />
    </DocLayout>
  );
}
