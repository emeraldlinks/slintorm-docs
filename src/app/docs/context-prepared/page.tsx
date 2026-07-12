import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';

export const metadata = {
  title: 'Context Propagation & Prepared Statements — SlintORM',
  description: 'SlintORM context propagation and prepared statement mode — per-request context, prepared statement caching for SQLite.',
  alternates: { canonical: '/docs/context-prepared' },
};

const contextExample = `// Set context for the current request/scope
import { orm } from './db';

async function handleRequest(req: Request) {
  // Attach request metadata
  orm.withContext({
    requestId: crypto.randomUUID(),
    userId: req.headers.get('x-user-id'),
    tenant: req.headers.get('x-tenant-id'),
  });

  try {
    const users = await orm.DB.User.getAll();
    return Response.json(users);
  } finally {
    // Always clear to prevent leaking across requests
    orm.clearContext();
  }
}`;

const getContextExample = `// Access context anywhere in your query pipeline
import { orm } from './db';

const User = orm.defineModel<User>('users', 'User', {
  onCreateBefore(data) {
    const ctx = orm.getContext();
    if (ctx?.userId) {
      return { ...data, createdBy: ctx.userId };
    }
    return data;
  },
});`;

const preparedExample = `// Toggle prepared statement caching
import ORMManager from 'slintorm';

const orm = new ORMManager({
  driver: 'sqlite',
  databaseUrl: './dev.db',
});

// Enable prepared mode
orm.preparedMode(true);
console.log('Prepared mode:', orm.isPreparedMode()); // true

// Queries are now cached as prepared statements
const users = await orm.DB.User.query().where("age", ">", 18).get();

// Disable when done
orm.preparedMode(false);`;

const preparedCache = `// Internal LRU cache behavior
// Max 200 prepared statements cached
// Eviction: LRU (least recently used)

// This is especially beneficial for repeated queries:
for (const id of userIds) {
  // With prepared mode on, the SQL is compiled once
  // and only the parameter changes on each iteration
  const user = await orm.DB.User.get({ id });
}`;

export default function ContextPreparedPage() {
  return (
    <DocLayout>
      <h1 style={{ marginBottom: '0.5rem' }}>Context Propagation & Prepared Statements</h1>

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Context Propagation</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        SlintORM provides a per-request/scope context store accessible throughout your data layer.
        Use <code>orm.withContext(ctx)</code> to attach metadata and <code>orm.getContext()</code> to retrieve it.
      </p>

      <h3 style={{ marginBottom: '0.5rem', marginTop: '1.5rem', color: 'var(--color-fg-muted)' }}>API Reference</h3>
      <div style={{ border: '1px solid var(--color-border)', borderRadius: '10px', overflow: 'hidden', marginBottom: '2rem' }}>
        <table>
          <thead>
            <tr>
              <th>Method</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>orm.withContext(ctx)</code></td>
              <td style={{ color: 'var(--color-fg-subtle)' }}>Set the context object for the current request/scope.</td>
            </tr>
            <tr>
              <td><code>orm.getContext()</code></td>
              <td style={{ color: 'var(--color-fg-subtle)' }}>Retrieve the current context object.</td>
            </tr>
            <tr>
              <td><code>orm.clearContext()</code></td>
              <td style={{ color: 'var(--color-fg-subtle)' }}>Clear the current context — call in <code>finally</code> blocks.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p style={{ marginBottom: '0.75rem' }}>
        Common use cases include request IDs for tracing, authenticated user IDs,
        tenant isolation in multi-tenant apps, and correlation IDs for distributed logging.
      </p>

      <h3 style={{ marginBottom: '0.5rem', marginTop: '1.5rem', color: 'var(--color-fg-muted)' }}>Setting context per request</h3>
      <CodeBlock code={contextExample} filename="handler.ts" />

      <h3 style={{ marginBottom: '0.5rem', marginTop: '1.5rem', color: 'var(--color-fg-muted)' }}>Using context in hooks</h3>
      <CodeBlock code={getContextExample} filename="models/user.ts" />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2.5rem' }}>Prepared Statement Mode</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        SQLite supports prepared statements — compiled SQL that can be reused with different parameters.
        SlintORM wraps this with an LRU cache (max 200 statements) to avoid re-parsing repeated queries.
      </p>

      <h3 style={{ marginBottom: '0.5rem', marginTop: '1.5rem', color: 'var(--color-fg-muted)' }}>API Reference</h3>
      <div style={{ border: '1px solid var(--color-border)', borderRadius: '10px', overflow: 'hidden', marginBottom: '2rem' }}>
        <table>
          <thead>
            <tr>
              <th>Method</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>orm.preparedMode(boolean)</code></td>
              <td style={{ color: 'var(--color-fg-subtle)' }}>Toggle prepared statement caching on/off.</td>
            </tr>
            <tr>
              <td><code>orm.isPreparedMode()</code></td>
              <td style={{ color: 'var(--color-fg-subtle)' }}>Return whether prepared mode is active.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 style={{ marginBottom: '0.5rem', marginTop: '1.5rem', color: 'var(--color-fg-muted)' }}>Enabling prepared mode</h3>
      <CodeBlock code={preparedExample} filename="db.ts" />

      <h3 style={{ marginBottom: '0.5rem', marginTop: '1.5rem', color: 'var(--color-fg-muted)' }}>Cache behavior & performance</h3>
      <p style={{ marginBottom: '0.75rem' }}>
        The cache holds up to 200 prepared statements with LRU eviction. This is most effective for
        hot paths — loops, batch operations, or frequently re-executed queries where only parameters
        change between invocations.
      </p>
      <CodeBlock code={preparedCache} filename="loop-example.ts" />
    </DocLayout>
  );
}
