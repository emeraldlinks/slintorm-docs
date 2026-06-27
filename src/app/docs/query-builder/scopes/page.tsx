import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';

export const metadata = { title: 'Scopes — SlintORM Query Builder' };

const basicScope = `// .scope(fn) — reusable, composable query fragment
// Available via model.extended() -> ExtendedQueryBuilder<T>
// Scopes are lazy — applied just before SQL is built

const activeUsers = await User.extended()
  .scope(q => q.where('active', '=', true))
  .get();`;

const namedScopes = `// Define named scope functions for reuse

// scopes.ts
import type { ExtendedQueryBuilder } from 'slintorm';

export const activeScope = (q: ExtendedQueryBuilder<any>) =>
  q.where('active', '=', true);

export const adminScope = (q: ExtendedQueryBuilder<any>) =>
  q.where('role', '=', 'admin');

export const recentScope = (q: ExtendedQueryBuilder<any>) =>
  q.orderBy('createdAt', 'DESC').limit(10);

// Use in queries:
import { activeScope, adminScope } from './scopes';

const activeAdmins = await User.extended()
  .scope(activeScope)
  .scope(adminScope)
  .get();`;

const composedScopes = `// Composing multiple scopes
// Each .scope() call adds its conditions — all are AND-ed

const results = await User.extended()
  .scope(q => q.where('active', '=', true))
  .scope(q => q.where('role', '=', 'admin'))
  .scope(q => q.whereNotNull('verifiedAt'))
  .scope(q => q.orderBy('name', 'ASC'))
  .get();

// WHERE active = 1 AND role = 'admin' AND verifiedAt IS NOT NULL
// ORDER BY name ASC`;

const scopeWithArgs = `// Scopes that accept parameters — return a scope function

const withRole = (role: string) =>
  (q: ExtendedQueryBuilder<any>) => q.where('role', '=', role);

const createdAfter = (date: string) =>
  (q: ExtendedQueryBuilder<any>) => q.where('createdAt', '>', date);

const users = await User.extended()
  .scope(withRole('admin'))
  .scope(createdAfter('2024-01-01'))
  .orderBy('name', 'ASC')
  .get();`;

const lazyExplained = `// Scopes are lazy — they run just before .buildSql() is called
// This means you can add scopes and other clauses in any order

const q = User.extended();

// Add scope and regular clauses interleaved — all resolved at build time
q.scope(q => q.where('active', '=', true));
q.orderBy('name', 'ASC');
q.scope(q => q.whereNotNull('email'));
q.limit(20);

const users = await q.get();
// All conditions applied correctly regardless of declaration order`;

export default function ScopesPage() {
  return (
    <DocLayout>
      <h1 style={{ marginBottom: '0.5rem' }}>Scopes</h1>
      <p style={{ marginBottom: '2rem', fontSize: '1.05rem' }}>
        <code>.scope(fn)</code> adds a reusable, composable query fragment to the builder.
        Available via <code>model.extended()</code> which returns an <code>ExtendedQueryBuilder&lt;T&gt;</code>.
        Scopes are lazy — they run just before SQL is built.
      </p>

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Basic scope</h2>
      <CodeBlock code={basicScope} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Named scope functions</h2>
      <CodeBlock code={namedScopes} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Composing multiple scopes</h2>
      <CodeBlock code={composedScopes} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Scopes with arguments</h2>
      <CodeBlock code={scopeWithArgs} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Lazy application</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        Scopes don't execute immediately. They're stored and applied when the query is built.
        This means you can mix scopes and regular clauses in any order.
      </p>
      <CodeBlock code={lazyExplained} />
    </DocLayout>
  );
}
