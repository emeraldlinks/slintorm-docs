import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';

export const metadata = { title: 'CRUD — SlintORM' };

const insertCode = `// insert(data) — returns EntityWithUpdate<T>
const user = await User.insert({
  email: 'joe@example.com',
  name: 'Joe',
});
console.log(user.id);         // auto-assigned
console.log(user.createdAt);  // set automatically
console.log(user.updatedAt);  // set automatically

// Returned entity has .update(), .delete(), .refresh(), .toJSON()
const updated = await user.update({ name: 'Joseph' });`;

const insertManyCode = `// insertMany(data[]) — batch insert
// On SQLite, wrapped in a single transaction for speed
const users = await User.insertMany([
  { email: 'alice@example.com', name: 'Alice' },
  { email: 'bob@example.com', name: 'Bob' },
  { email: 'carol@example.com', name: 'Carol' },
]);
console.log(users.length); // 3`;

const getCode = `// get(filter) — returns EntityWithUpdate<T> | null
const user = await User.get({ email: 'joe@example.com' });
if (!user) {
  throw new Error('User not found');
}
console.log(user.name);

// Multiple filters (AND)
const admin = await User.get({ role: 'admin', active: true });`;

const getAllCode = `// getAll(filter?) — returns EntityWithUpdate<T>[]
const allUsers = await User.getAll();
const admins = await User.getAll({ role: 'admin' });

// All returned entities have .update(), .delete(), etc.
for (const user of admins) {
  await user.update({ notifiedAt: new Date().toISOString() });
}`;

const updateCode = `// update(filter, data) — auto-sets updatedAt
const count = await User.update(
  { role: 'user' },
  { role: 'member' }
);
console.log(count); // number of rows updated

// update returns number of affected rows for updateMany
const affected = await User.updateMany(
  { status: 'pending' },
  { status: 'active' }
);`;

const deleteCode = `// delete(filter) — non-empty filter required
await User.delete({ id: 42 });

// deleteMany(filter) — returns number deleted
const count = await User.deleteMany({ role: 'guest' });
console.log(\`Deleted \${count} guests\`);`;

const upsertCode = `// upsert(data, conflictKey)
// Postgres: ON CONFLICT (email) DO UPDATE
// MySQL: ON DUPLICATE KEY UPDATE
// SQLite / MongoDB: manual get-then-insert-or-update

const user = await User.upsert(
  { email: 'joe@example.com', name: 'Joe', role: 'admin' },
  'email'   // conflict column
);`;

const findOrCreateCode = `// findOrCreate(filter, defaults?) — returns { record, created }
const { record, created } = await User.findOrCreate(
  { email: 'joe@example.com' },
  { name: 'Joe', role: 'user' }  // defaults if creating
);

if (created) {
  console.log('New user:', record.id);
} else {
  console.log('Existing user:', record.id);
}`;

const existsCode = `// exists(filter) — returns boolean
const taken = await User.exists({ email: 'joe@example.com' });
if (taken) {
  throw new Error('Email already registered');
}`;

const aggregatesCode = `// count(filter?) — count matching rows
const total = await User.count();
const admins = await User.count({ role: 'admin' });

// Scalar aggregates on a column
const totalSpend = await Order.sum('amount', { userId: 42 });
const avgRating  = await Review.avg('rating', { productId: 7 });
const earliest   = await Event.min('startDate');
const latest     = await Event.max('endDate');`;

const truncateCode = `// truncate() — deletes ALL rows. Use with care.
await TempData.truncate();`;

const restoreCode = `// restore(filter) — un-soft-delete rows
// Only available when the model has a @softDelete field

await User.delete({ id: 42 });          // soft-deletes
const user = await User.get({ id: 42 }); // null — filtered out

await User.restore({ id: 42 });
const back = await User.get({ id: 42 }); // found again`;

export default function CrudPage() {
  return (
    <DocLayout>
      <h1 style={{ marginBottom: '0.5rem' }}>CRUD</h1>
      <p style={{ marginBottom: '2rem', fontSize: '1.05rem' }}>
        Every model returned by <code>defineModel</code> has a full set of create, read, update, and delete methods.
        All mutating methods auto-manage <code>createdAt</code> and <code>updatedAt</code>.
      </p>

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>insert</h2>
      <CodeBlock code={insertCode} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>insertMany</h2>
      <CodeBlock code={insertManyCode} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>get</h2>
      <CodeBlock code={getCode} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>getAll</h2>
      <CodeBlock code={getAllCode} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>update / updateMany</h2>
      <CodeBlock code={updateCode} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>delete / deleteMany</h2>
      <CodeBlock code={deleteCode} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>upsert</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        Inserts a row or updates it if the conflict column already exists.
        The implementation varies by driver: <code>ON CONFLICT</code> on Postgres,
        <code>ON DUPLICATE KEY</code> on MySQL, manual lookup on SQLite and MongoDB.
      </p>
      <CodeBlock code={upsertCode} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>findOrCreate</h2>
      <CodeBlock code={findOrCreateCode} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>exists</h2>
      <CodeBlock code={existsCode} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>count / sum / avg / min / max</h2>
      <CodeBlock code={aggregatesCode} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>truncate</h2>
      <CodeBlock code={truncateCode} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>restore</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        Only applies to models with a <code>@softDelete</code> annotated field.
        Sets <code>deletedAt</code> back to <code>NULL</code>.
      </p>
      <CodeBlock code={restoreCode} />
    </DocLayout>
  );
}
