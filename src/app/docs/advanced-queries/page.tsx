import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';

export const metadata = {
  title: 'Advanced Queries — SlintORM',
  description: 'SlintORM advanced query features — group conditions, named arguments, multi-column IN, query hints, afterFind hook, dry-run mode.',
  alternates: { canonical: '/docs/advanced-queries' },
};

const andWhereGroup = `// andWhereGroup(fn) — nest conditions with AND
const users = await User.query()
  .where('active', '=', true)
  .andWhereGroup(q => {
    q.where('role', '=', 'admin')
     .orWhere('role', '=', 'moderator');
  })
  .get();

// SQL: SELECT * FROM users
//      WHERE active = true
//        AND (role = ? OR role = ?)`;

const orWhereGroup = `// orWhereGroup(fn) — nest conditions with OR
const posts = await Post.query()
  .orWhereGroup(q => {
    q.where('status', '=', 'draft')
     .where('authorId', '=', 42);
  })
  .orWhereGroup(q => {
    q.where('status', '=', 'published')
     .where('featured', '=', true);
  })
  .get();

// SQL: SELECT * FROM posts
//      WHERE (status = ? AND authorId = ?)
//         OR (status = ? AND featured = ?)`;

const namedWhere = `// namedWhere(sql, params) — named placeholder replacement
const users = await User.query()
  .where('active', '=', true)
  .namedWhere('name LIKE :pattern AND age > :minAge', {
    pattern: 'A%',
    minAge: 18,
  })
  .get();

// SQL: SELECT * FROM users
//      WHERE active = true
//        AND name LIKE ? AND age > ?
// params: ['A%', 18]

// Supports :name, @name, and $name placeholder styles`;

const multiColumnIn = `// whereColumnsIn(columns[], values[][]) — composite IN
const results = await Product.query()
  .whereColumnsIn(
    ['category', 'status'],
    [
      ['electronics', 'active'],
      ['clothing', 'active'],
      ['books', 'inactive'],
    ]
  )
  .get();

// SQL (Postgres): SELECT * FROM products
//      WHERE (category, status) IN (($1,$2),($3,$4),($5,$6))
// SQL (MySQL):    SELECT * FROM products
//      WHERE (category, status) IN ((?,?),(?,?),(?,?))
// SQL (SQLite):   SELECT * FROM products
//      WHERE (category, status) IN (?,?,?)
//      -- SQLite flattens to positional placeholders
// params: ['electronics', 'active', 'clothing', 'active', 'books', 'inactive']`;

const hint = `// hint(hintString) — attach optimizer hints
// Postgres:  /*+ NO_INDEX */  (pg_hint_plan extension)
// MySQL:     SELECT /*+ NO_INDEX(users idx_email) */ ...
// SQLite:    ignored (no hint support)

const users = await User.query()
  .hint('/*+ NO_INDEX(users idx_email) */')
  .where('email', '=', 'joe@example.com')
  .get();

// The hint is inserted after SELECT:
// SELECT /*+ NO_INDEX(users idx_email) */ * FROM users ...`;

const commentHint = `// commentHint(comment) — attach a SQL comment hint
// Useful for database monitoring tools (e.g., pgbadger, MySQL slow query log)

const users = await User.query()
  .commentHint('report: daily-active-users')
  .where('active', '=', true)
  .get();

// SQL: SELECT * FROM users /* report: daily-active-users */
//      WHERE active = true`;

const afterFind = `// afterFind(fn) — transform rows after fetch
const users = await User.query()
  .where('active', '=', true)
  .afterFind(rows =>
    rows.map(user => ({
      ...user,
      fullName: \`\${user.firstName} \${user.lastName}\`,
    }))
  )
  .get();

// Each row in the returned array has the computed fullName field
// The original entities are not modified — afterFind returns new objects`;

const afterFindAsync = `// afterFind can be async
const enriched = await Order.query()
  .where('status', '=', 'pending')
  .afterFind(async orders => {
    // Fetch additional data for each order
    const enriched = await Promise.all(
      orders.map(async order => ({
        ...order,
        customer: await Customer.get({ id: order.customerId }),
      }))
    );
    return enriched;
  })
  .get();`;

const dryRun = `// dryRun() — returns { sql, params } without executing
const query = User.query()
  .where('role', '=', 'admin')
  .whereNotNull('verifiedAt')
  .orderBy('name', 'ASC')
  .limit(10)
  .dryRun();

console.log(query.sql);
// "SELECT * FROM users WHERE role = ? AND verifiedAt IS NOT NULL ORDER BY name ASC LIMIT ?"

console.log(query.params);
// ['admin', 10]

// Useful for debugging, logging, or manual query inspection`;

const dryRunInsert = `// dryRun() also works on insert/update/delete
const insertQuery = User.insert({
  email: 'test@example.com',
  name: 'Test',
}).dryRun();

console.log(insertQuery.sql);
// "INSERT INTO users (email, name, createdAt, updatedAt) VALUES (?, ?, ?, ?)"
console.log(insertQuery.params);
// ['test@example.com', 'Test', ...]`;

export default function AdvancedQueriesPage() {
  return (
    <DocLayout>
      <h1 style={{ marginBottom: '0.5rem' }}>Advanced Queries</h1>
      <p style={{ marginBottom: '2rem', fontSize: '1.05rem' }}>
        SlintORM&apos;s query builder exposes a set of advanced methods for
        complex query patterns — grouped conditions, named parameters,
        multi-column <code>IN</code>, optimizer hints, post-fetch transforms,
        and a dry-run mode for debugging.
      </p>

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Group conditions</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        Use <code>andWhereGroup(fn)</code> and <code>orWhereGroup(fn)</code> to
        nest WHERE clauses inside parentheses with the desired boolean
        conjunction.
      </p>

      <h3 style={{ marginBottom: '0.75rem', marginTop: '1.5rem' }}>andWhereGroup</h3>
      <CodeBlock code={andWhereGroup} />

      <h3 style={{ marginBottom: '0.75rem', marginTop: '1.5rem' }}>orWhereGroup</h3>
      <CodeBlock code={orWhereGroup} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Named arguments</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        <code>namedWhere(sql, params)</code> lets you write raw SQL fragments
        with named placeholders (<code>:name</code>, <code>@name</code>,{' '}
        <code>$name</code>) that are replaced with positional or numbered
        placeholders per driver.
      </p>
      <CodeBlock code={namedWhere} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Multi-column IN</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        <code>whereColumnsIn(columns[], values[][])</code> generates a
        composite <code>IN</code> clause matching tuples of columns against
        tuples of values. The placeholder style adapts to each driver.
      </p>
      <CodeBlock code={multiColumnIn} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Query hints</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        <code>hint(str)</code> attaches an optimizer hint directly after
        <code>SELECT</code>. <code>commentHint(str)</code> attaches a SQL
        comment for monitoring tools. Support varies by driver.
      </p>
      <CodeBlock code={hint} />
      <CodeBlock code={commentHint} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>AfterFind hook</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        <code>afterFind(fn)</code> registers a transform function that runs on
        the result set after the query executes. The function receives the
        rows and must return the transformed rows. Supports async transforms.
      </p>
      <CodeBlock code={afterFind} />
      <CodeBlock code={afterFindAsync} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Dry-run mode</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        <code>dryRun()</code> returns <code>{'{ sql, params }'}</code> instead
        of executing the query. Works on all query types including insert,
        update, and delete. Essential for debugging generated SQL.
      </p>
      <CodeBlock code={dryRun} />
      <CodeBlock code={dryRunInsert} />
    </DocLayout>
  );
}
