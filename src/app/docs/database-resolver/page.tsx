import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';

export const metadata = {
  title: 'Database Resolver — SlintORM',
  description: 'SlintORM database resolver — manage multiple database connections, route models to different databases, execute raw SQL on named databases.',
  alternates: { canonical: '/docs/database-resolver' },
};

const addDbExample = `// Register multiple named databases
import ORMManager from 'slintorm';

const orm = new ORMManager({
  driver: 'sqlite',
  databaseUrl: './primary.db',
});

// Add a secondary analytics database
orm.addDatabase('analytics', {
  driver: 'sqlite',
  databaseUrl: './analytics.db',
});

// Add a Postgres reporting database
orm.addDatabase('reporting', {
  driver: 'postgres',
  databaseUrl: process.env.PG_REPORTING_URL!,
});`;

const resolveExample = `// Get the raw database adapter for a named database
const db = orm.resolveDb('analytics');
// db is the driver-specific adapter instance
// Use it for low-level operations`;

const removeExample = `// Unregister a database when no longer needed
orm.removeDatabase('analytics');
// All connections are cleaned up`;

const execRawExample = `// Execute raw SQL on a named database
const users = await orm.execOn('reporting', 'SELECT * FROM users WHERE active = ?', [true]);
// Returns SQLExecResult with columns, rows, and rowCount`;

const modelRoutingExample = `// Route a model to a specific database
import { orm } from './db';

// Define the model normally (uses default database)
const User = orm.defineModel<User>('users', 'User');

// Create an instance bound to a different database
const AnalyticsUser = User.useDb('analytics');

// Now queries on AnalyticsUser run against 'analytics' database
const localUsers = await User.getAll();
const analyticsUsers = await AnalyticsUser.getAll();`;

const multiTenantExample = `// Multi-tenant routing — one database per tenant
const databases = ['tenant_a', 'tenant_b', 'tenant_c'];

for (const tenant of databases) {
  orm.addDatabase(tenant, {
    driver: 'postgres',
    databaseUrl: process.env[tenant.toUpperCase() + '_URL']!,
  });
}

async function getUsersForTenant(tenantId: string) {
  const TenantBoundUser = orm.DB.User.useDb(tenantId);
  return TenantBoundUser.getAll();
}`;

const readWriteSplit = `// Read/write splitting
orm.addDatabase('primary', {
  driver: 'postgres',
  databaseUrl: process.env.PG_WRITER_URL!,
});

orm.addDatabase('replica', {
  driver: 'postgres',
  databaseUrl: process.env.PG_READER_URL!,
});

const User = orm.defineModel<User>('users', 'User');
const UserRead = User.useDb('replica');

// Writes go to primary, reads go to replica
await User.insert({ name: 'Alice' });        // primary
const users = await UserRead.getAll();       // replica`;

export default function DatabaseResolverPage() {
  return (
    <DocLayout>
      <h1 style={{ marginBottom: '0.5rem' }}>Database Resolver</h1>
      <p style={{ marginBottom: '2rem', fontSize: '1.05rem' }}>
        SlintORM's database resolver lets you manage multiple database connections from a single ORM instance.
        Add named databases, route models to them, and execute raw SQL on any connection.
      </p>

      <h2 style={{ marginBottom: '1rem', marginTop: '2rem' }}>API Reference</h2>
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
              <td><code>orm.addDatabase(name, config)</code></td>
              <td style={{ color: 'var(--color-fg-subtle)' }}>Register a named database connection.</td>
            </tr>
            <tr>
              <td><code>orm.resolveDb(name)</code></td>
              <td style={{ color: 'var(--color-fg-subtle)' }}>Get the underlying database adapter for a name.</td>
            </tr>
            <tr>
              <td><code>orm.removeDatabase(name)</code></td>
              <td style={{ color: 'var(--color-fg-subtle)' }}>Unregister a database and clean up connections.</td>
            </tr>
            <tr>
              <td><code>orm.execOn(name, sql, params?)</code></td>
              <td style={{ color: 'var(--color-fg-subtle)' }}>Execute raw SQL on a named database.</td>
            </tr>
            <tr>
              <td><code>model.useDb(name)</code></td>
              <td style={{ color: 'var(--color-fg-subtle)' }}>Create a model instance bound to a specific database.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2.5rem' }}>Adding databases</h2>
      <CodeBlock code={addDbExample} filename="db.ts" />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Resolving a database adapter</h2>
      <CodeBlock code={resolveExample} filename="example.ts" />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Removing a database</h2>
      <CodeBlock code={removeExample} filename="cleanup.ts" />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Raw SQL execution</h2>
      <CodeBlock code={execRawExample} filename="queries.ts" />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Model routing with <code>useDb</code></h2>
      <CodeBlock code={modelRoutingExample} filename="routing.ts" />

      <h2 style={{ marginBottom: '1rem', marginTop: '2.5rem' }}>Use cases</h2>

      <h3 style={{ marginBottom: '0.5rem', color: 'var(--color-fg-muted)' }}>Multi-tenant databases</h3>
      <p style={{ marginBottom: '0.75rem' }}>Route each tenant to their own database for strict data isolation.</p>
      <CodeBlock code={multiTenantExample} filename="multi-tenant.ts" />

      <h3 style={{ marginBottom: '0.75rem', marginTop: '1.5rem', color: 'var(--color-fg-muted)' }}>Read/write splitting</h3>
      <p style={{ marginBottom: '0.75rem' }}>Send writes to a primary database and reads to a replica.</p>
      <CodeBlock code={readWriteSplit} filename="read-write-split.ts" />
    </DocLayout>
  );
}
