import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';

export const metadata = {
  title: 'Scopes — SlintORM Query Builder',
  description: "SlintORM scopes and ExtendedQueryBuilder — scope(), inherited methods, Validator standalone class.",
  alternates: { canonical: '/docs/query-builder/scopes' },
};

const extendedClass = `// ExtendedQueryBuilder<T> — returned by model.query()
// Extends QueryBuilder<T> with one additional method: scope()
//
// This means ALL base QueryBuilder methods are available:
//   .where()        .orWhere()       .whereRaw()
//   .whereIn()      .whereNotIn()    .whereNull()     .whereNotNull()
//   .whereBetween() .ILike()
//   .select()       .exclude()       .orderBy()
//   .limit()        .offset()        .paginate()
//   .join()         .leftJoin()      .preload()
//   .throughRelation() .whereRelated() .relatedTo()
//   .get()          .first()         .getPaginated()
//
// Plus:
//   .scope(fn)      — add a reusable, lazily-applied query fragment

const users = await User.query()
  .where('active', '=', true)     // base QB method
  .preload('posts')               // base QB method
  .scope(q => q.whereNotNull('verifiedAt'))  // ExtendedQueryBuilder only
  .orderBy('name', 'ASC')         // base QB method
  .limit(50)                      // base QB method
  .get();`;

const basicScope = `// .scope(fn) — reusable, composable query fragment
// Scopes are lazy — applied just before SQL is built

const activeUsers = await User.query()
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

const activeAdmins = await User.query()
  .scope(activeScope)
  .scope(adminScope)
  .get();`;

const composedScopes = `// Composing multiple scopes
// Each .scope() call adds its conditions — all are AND-ed

const results = await User.query()
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

const users = await User.query()
  .scope(withRole('admin'))
  .scope(createdAfter('2024-01-01'))
  .orderBy('name', 'ASC')
  .get();`;

const scopeWithPreload = `// Scopes work alongside ALL other QB methods
// including preload, join, paginate

const publishedPostsForTeam = await Post.query()
  .scope(q => q.where('published', '=', true))
  .scope(q => q.whereNotNull('publishedAt'))
  .preload('user')
  .preload('comments')
  .exclude('user.password')
  .orderBy('publishedAt', 'DESC')
  .getPaginated(1, 20);

// Scopes are resolved last, but the resulting SQL is identical to
// writing .where() calls directly — no performance difference`;

const lazyExplained = `// Scopes are lazy — they run just before .buildSql() is called
// This means you can add scopes and other clauses in any order

const q = User.query();

// Interleave scopes and regular clauses — all resolved at build time
q.scope(q => q.where('active', '=', true));
q.orderBy('name', 'ASC');
q.scope(q => q.whereNotNull('email'));
q.limit(20);

const users = await q.get();
// All conditions applied correctly regardless of declaration order`;

const standaloneValidator = `// Validator<T> — standalone class exported from 'slintorm'
// The same engine used by model.validate() and model.check()
// Use it outside of a model context if needed

import { Validator } from 'slintorm';

const validator = new Validator<{ email: string; age: number }>({
  email: { required: true, email: true },
  age:   { required: true, min: 18 },
});

// validate() — throws ValidationError on invalid data
validator.validate({ email: 'bad', age: 15 });

// check() — returns error map or null
const errors = validator.check({ email: 'joe@example.com', age: 25 });
// null — all valid`;

export default function ScopesPage() {
  return (
    <DocLayout>
      <h1 style={{ marginBottom: '0.5rem' }}>Scopes & ExtendedQueryBuilder</h1>
      <p style={{ marginBottom: '2rem', fontSize: '1.05rem' }}>
        <code>model.query()</code> returns an <code>ExtendedQueryBuilder&lt;T&gt;</code> —
        a full <code>QueryBuilder&lt;T&gt;</code> with one additional method: <code>.scope(fn)</code>.
        Every base QB method (<code>where</code>, <code>preload</code>, <code>orderBy</code>, etc.) is available.
      </p>

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>ExtendedQueryBuilder — what it inherits</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        <code>ExtendedQueryBuilder&lt;T&gt;</code> is a superset of <code>QueryBuilder&lt;T&gt;</code>.
        Use it exactly like <code>model.query()</code> but with <code>.scope()</code> available.
      </p>
      <CodeBlock code={extendedClass} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Basic scope</h2>
      <CodeBlock code={basicScope} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Named scope functions</h2>
      <CodeBlock code={namedScopes} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Composing multiple scopes</h2>
      <CodeBlock code={composedScopes} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Scopes with arguments</h2>
      <CodeBlock code={scopeWithArgs} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Scopes alongside preload, join, paginate</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        Because <code>ExtendedQueryBuilder</code> inherits the full base QB, scopes compose
        naturally with every other method.
      </p>
      <CodeBlock code={scopeWithPreload} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Lazy application</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        Scopes don&apos;t execute immediately. They&apos;re stored and applied just before
        <code>.buildSql()</code> is called, so you can mix scopes and regular clauses in any order.
      </p>
      <CodeBlock code={lazyExplained} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Validator — standalone class</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        <code>Validator&lt;T&gt;</code> is the class behind <code>model.validate()</code> and
        <code>model.check()</code>. It&apos;s exported directly from <code>slintorm</code> for
        use outside of a model context — validating arbitrary objects, request bodies, or config.
      </p>
      <CodeBlock code={standaloneValidator} />
    </DocLayout>
  );
}
