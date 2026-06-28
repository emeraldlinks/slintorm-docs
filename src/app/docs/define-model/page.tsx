import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';

export const metadata = { title: 'defineModel — SlintORM' };

const manualExport = `// db.ts
import ORMManager from 'slintorm';

interface User {
  id: number;
  email: string;
  name: string;
}

interface Post {
  id: number;
  title: string;
  userId: number;
}

const orm = new ORMManager({ driver: 'sqlite', databaseUrl: './dev.db' });
await orm.migrate();

// Export each model individually
export const User = orm.defineModel<User>('users', 'User');
export const Post = orm.defineModel<Post>('posts', 'Post');`;

const withHooks = `// db.ts — defineModel with hooks
import bcrypt from 'bcrypt';

interface User {
  id: number;
  email: string;
  password: string;
  name: string;
}

export const User = orm.defineModel<User>('users', 'User', {
  async onCreateBefore(data) {
    // Hash password before insert — returned value replaces the record
    return { ...data, password: await bcrypt.hash(data.password, 10) };
  },
  async onCreateAfter(item) {
    console.log('User created:', item.id);
  },
  async onUpdateBefore(oldData, newData) {
    if (newData.password) {
      return { ...newData, password: await bcrypt.hash(newData.password, 10) };
    }
  },
  async onUpdateAfter(oldData, newData) {
    console.log(\`User \${oldData.id} updated\`);
  },
  onDeleteBefore(deleted) {
    console.log('Deleting user:', deleted.id);
  },
  onDeleteAfter(deleted) {
    console.log('User deleted:', deleted.id);
  },
});`;

const modelMapPattern = `// db.ts — ModelMap pattern (recommended for large projects)
import ORMManager from 'slintorm';
import type { ModelMap } from './schema/generated';

const orm = new ORMManager<typeof ModelMap>({
  driver: 'sqlite',
  databaseUrl: './dev.db',
  modelMap: {} as typeof ModelMap,
});

await orm.migrate();

// Access all models through the typed db store
export const db = orm.db;

// Usage:
// db.User.insert({ email: 'a@b.com', name: 'Alice' })
// db.Post.getAll()`;

const entityMethods = `// EntityWithUpdate<T> — methods on returned rows

const user = await User.get({ email: 'joe@example.com' });
// user is EntityWithUpdate<User> | null

if (user) {
  // .update(partial) — updates in DB, returns updated entity
  const updated = await user.update({ name: 'Joseph' });

  // .delete() — deletes from DB (or soft-deletes if @softDelete)
  await user.delete();

  // .refresh() — re-fetches from DB, returns updated snapshot
  const fresh = await user.refresh();

  // .toJSON() — strips ORM methods, returns plain object
  const plain = user.toJSON();
}`;

const methods = [
  { name: 'insert(data)', desc: 'Insert a row, returns EntityWithUpdate<T>' },
  { name: 'insertMany(data[])', desc: 'Batch insert rows, wrapped in a transaction on SQLite' },
  { name: 'get(filter)', desc: 'Get first matching row or null' },
  { name: 'getAll(filter?)', desc: 'Get all matching rows' },
  { name: 'update(filter, data)', desc: 'Update matching rows, auto-sets updatedAt' },
  { name: 'updateMany(filter, data)', desc: 'Batch update, returns number of affected rows' },
  { name: 'delete(filter)', desc: 'Delete matching rows (hard delete or soft delete)' },
  { name: 'deleteMany(filter)', desc: 'Batch delete, returns number of affected rows' },
  { name: 'upsert(data, conflictKey)', desc: 'Insert or update on conflict' },
  { name: 'findOrCreate(filter, defaults?)', desc: 'Find or insert, returns { record, created }' },
  { name: 'exists(filter)', desc: 'Returns boolean — true if any row matches' },
  { name: 'count(filter?)', desc: 'Count matching rows' },
  { name: 'sum(col, filter?)', desc: 'Scalar SUM of a column' },
  { name: 'avg(col, filter?)', desc: 'Scalar AVG of a column' },
  { name: 'min(col, filter?)', desc: 'Scalar MIN of a column' },
  { name: 'max(col, filter?)', desc: 'Scalar MAX of a column' },
  { name: 'truncate()', desc: 'Delete all rows' },
  { name: 'restore(filter)', desc: 'Un-delete soft-deleted rows' },
  { name: 'validate(data, rules)', desc: 'Validate data, throws ValidationError on failure' },
  { name: 'check(data, rules)', desc: 'Validate data, returns error map or null' },
  { name: 'query()', desc: 'Returns a QueryBuilder<T> for fluent query building' },
  { name: 'advanced()', desc: 'Returns an AdvancedQueryBuilder<T> (aggregates, window functions)' },
  { name: 'softDelete()', desc: 'Returns a SoftDeleteQueryBuilder<T> (withTrashed, onlyTrashed)' },
  { name: 'extended()', desc: 'Returns an ExtendedQueryBuilder<T> with scope() support' },
];

export default function DefineModelPage() {
  return (
    <DocLayout>
      <h1 style={{ marginBottom: '0.5rem' }}>defineModel</h1>
      <p style={{ marginBottom: '2rem', fontSize: '1.05rem' }}>
        <code>orm.defineModel&lt;T&gt;(table, modelName, hooks?)</code> registers a model and returns a <code>ModelAPI&lt;T&gt;</code>
        with 24 methods for querying and mutating that table.
      </p>

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Manual export pattern</h2>
      <CodeBlock code={manualExport} filename="db.ts" />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>With lifecycle hooks</h2>
      <CodeBlock code={withHooks} filename="db.ts" />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>ModelMap pattern</h2>
      <p style={{ marginBottom: '1rem' }}>
        For larger projects, use the generated <code>ModelMap</code> to get a typed <code>db</code> store
        without needing to export each model individually.
      </p>
      <CodeBlock code={modelMapPattern} filename="db.ts" />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2.5rem' }}>EntityWithUpdate methods</h2>
      <p style={{ marginBottom: '1rem' }}>
        Every row returned by <code>get()</code>, <code>insert()</code>, or <code>findOrCreate()</code> is augmented
        with convenience methods for mutation and refresh.
      </p>
      <CodeBlock code={entityMethods} filename="example.ts" />

      <h2 style={{ marginBottom: '1rem', marginTop: '2.5rem' }}>ModelAPI method reference</h2>
      <p style={{ marginBottom: '1rem' }}>All 24 methods available on every model instance:</p>
      <div style={{ border: '1px solid var(--color-border)', borderRadius: '10px', overflow: 'hidden' }}>
        <table>
          <thead>
            <tr>
              <th>Method</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {methods.map(m => (
              <tr key={m.name}>
                <td><code style={{ fontSize: '0.8rem' }}>{m.name}</code></td>
                <td style={{ color: 'var(--color-fg-subtle)' }}>{m.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DocLayout>
  );
}
