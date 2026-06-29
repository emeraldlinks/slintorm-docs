import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';

export const metadata = {
  title: 'select() — SlintORM Query Builder',
  description: "SlintORM query builder — select(), exclude(), and get() terminal method with return type reference.",
  alternates: { canonical: '/docs/query-builder/select' },
};

const selectBasic = `// select(...columns) — pick specific columns
const users = await User.query()
  .select('id', 'name', 'email')
  .get();
// SELECT id, name, email FROM users WHERE deletedAt IS NULL`;

const selectAll = `// No .select() — returns all columns
const users = await User.query().get();
// SELECT users.* FROM users WHERE deletedAt IS NULL`;

const selectWithJoin = `// When joins are present, unqualified table columns
// are auto-qualified to prevent ambiguity

const posts = await Post.query()
  .join('users', 'posts.userId', '=', 'users.id')
  .select('posts.id', 'posts.title', 'users.name')
  .get();
// SELECT posts.id, posts.title, users.name
// FROM posts
// INNER JOIN users ON posts.userId = users.id`;

const selectExclude = `// .exclude(column) — strip columns from result
// Useful for hiding sensitive fields like passwords

const users = await User.query()
  .exclude('password')
  .exclude('secretToken')
  .get();
// Returns all columns except password and secretToken`;

const selectNested = `// exclude() also works on preloaded relations
const posts = await Post.query()
  .preload('user')
  .exclude('user.password')   // strips from nested user objects
  .get();`;

const getMethod = `// .get() — terminal method, executes the query
// Returns EntityWithUpdate<T>[] — every row augmented with
// .update(), .delete(), .refresh(), .toJSON()

const users = await User.query()
  .where('active', '=', true)
  .orderBy('name', 'ASC')
  .get();

// users is EntityWithUpdate<User>[]
// users[0].update({ name: 'Bob' })  — works directly
// users[0].toJSON()                 — plain object, no ORM methods

// Empty result: returns [] not null
const none = await User.query()
  .where('role', '=', 'nonexistent')
  .get();
// none.length === 0`;

export default function SelectPage() {
  return (
    <DocLayout>
      <h1 style={{ marginBottom: '0.5rem' }}>select()</h1>
      <p style={{ marginBottom: '2rem', fontSize: '1.05rem' }}>
        <code>select(...cols)</code> picks which columns appear in the result.
        When joins are present and no <code>select()</code> is called, SlintORM
        auto-qualifies to <code>table.*</code> to avoid ambiguity errors.
      </p>

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Basic column selection</h2>
      <CodeBlock code={selectBasic} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>No selection (all columns)</h2>
      <CodeBlock code={selectAll} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>select() with joins</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        When joins are active, qualify columns with the table name to avoid collisions on <code>id</code>, <code>createdAt</code>, etc.
      </p>
      <CodeBlock code={selectWithJoin} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>exclude()</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        <code>exclude(column)</code> removes a column from the result after fetching.
        It can target root columns or nested preloaded relation columns using dot notation.
      </p>
      <CodeBlock code={selectExclude} />
      <CodeBlock code={selectNested} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>get() — execute the query</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        <code>.get()</code> is the primary terminal method on every builder. It fires the accumulated
        SQL and returns <code>EntityWithUpdate&lt;T&gt;[]</code>. No query is sent to the database
        until <code>.get()</code>, <code>.first()</code>, or <code>.getPaginated()</code> is called.
      </p>
      <CodeBlock code={getMethod} />
    </DocLayout>
  );
}
