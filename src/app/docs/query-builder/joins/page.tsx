import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';

export const metadata = {
  title: 'Joins — SlintORM Query Builder',
  description: "SlintORM query builder — INNER, LEFT, RIGHT, FULL OUTER joins, multi-join patterns, auto-qualification.",
  alternates: { canonical: '/docs/query-builder/joins' },
};

const innerJoin = `// .join(table, left, op, right) — INNER JOIN
const posts = await Post.query()
  .join('users', 'posts.userId', '=', 'users.id')
  .select('posts.id', 'posts.title', 'users.name', 'users.email')
  .get();
// SELECT posts.id, posts.title, users.name, users.email
// FROM posts
// INNER JOIN users ON posts.userId = users.id`;

const leftJoin = `// .leftJoin(table, left, op, right) — LEFT JOIN
// Returns all posts, even those without a matching user
const posts = await Post.query()
  .leftJoin('users', 'posts.userId', '=', 'users.id')
  .select('posts.*', 'users.name')
  .get();`;

const rightJoin = `// .rightJoin(table, left, op, right) — RIGHT JOIN
// Available via advanced() (AdvancedQueryBuilder)
const data = await Post.advanced()
  .rightJoin('users', 'posts.userId', '=', 'users.id')
  .select('users.name', 'posts.title')
  .get();`;

const fullOuter = `// .fullOuterJoin(table, left, op, right) — FULL OUTER JOIN
// Available via advanced() (AdvancedQueryBuilder)
// Note: SQLite does not support FULL OUTER JOIN natively
const data = await Post.advanced()
  .fullOuterJoin('users', 'posts.userId', '=', 'users.id')
  .get();`;

const multiJoin = `// Multiple joins
const results = await Post.query()
  .join('users', 'posts.userId', '=', 'users.id')
  .join('categories', 'posts.categoryId', '=', 'categories.id')
  .select(
    'posts.id',
    'posts.title',
    'users.name',
    'categories.name'
  )
  .where('users.role', '=', 'author')
  .orderBy('posts.createdAt', 'DESC')
  .get();`;

const joinWithWhereRaw = `// Complex join conditions with whereRaw
const results = await Post.query()
  .join('post_tags', 'posts.id', '=', 'post_tags.postId')
  .join('tags', 'post_tags.tagId', '=', 'tags.id')
  .whereRaw('tags.name IN (?, ?)', ['typescript', 'orm'])
  .select('posts.id', 'posts.title')
  .get();`;

const autoQualify = `// When joins are present and no .select() is called,
// SlintORM auto-qualifies root table columns to "table.*"
// to prevent "ambiguous column" errors from the database

const posts = await Post.query()
  .join('users', 'posts.userId', '=', 'users.id')
  // No .select() — SlintORM emits: SELECT posts.* FROM posts ...
  .get();`;

export default function JoinsPage() {
  return (
    <DocLayout>
      <h1 style={{ marginBottom: '0.5rem' }}>Joins</h1>
      <p style={{ marginBottom: '2rem', fontSize: '1.05rem' }}>
        SlintORM supports INNER, LEFT, RIGHT, and FULL OUTER joins.
        RIGHT and FULL OUTER are available via <code>model.advanced()</code>.
      </p>

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>INNER join</h2>
      <CodeBlock code={innerJoin} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>LEFT join</h2>
      <CodeBlock code={leftJoin} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>RIGHT join</h2>
      <CodeBlock code={rightJoin} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>FULL OUTER join</h2>
      <CodeBlock code={fullOuter} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Multiple joins</h2>
      <CodeBlock code={multiJoin} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Complex conditions with whereRaw</h2>
      <CodeBlock code={joinWithWhereRaw} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Auto-qualification</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        When joins are active and no explicit <code>select()</code> is provided,
        SlintORM automatically qualifies the root table to <code>table.*</code>
        to avoid ambiguous column errors on shared names like <code>id</code>.
      </p>
      <CodeBlock code={autoQualify} />

      <div style={{
        background: 'rgba(59, 130, 246, 0.08)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        borderRadius: '8px',
        padding: '1rem 1.25rem',
        marginTop: '2rem',
        fontSize: '0.875rem',
      }}>
        <strong style={{ color: '#60A5FA', fontFamily: 'var(--font-mono)' }}>Prefer preloads over joins for relations</strong>
        <p style={{ marginTop: '0.25rem', color: 'var(--color-fg-muted)' }}>
          Manual joins are best for arbitrary SQL relationships. For loading related records declared
          in model annotations (<code>@relation</code>), use <code>.preload("relation")</code> instead.
          Preloads batch-fetch related records without N+1 queries.
        </p>
      </div>
    </DocLayout>
  );
}
