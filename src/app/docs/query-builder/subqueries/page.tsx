import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';

export const metadata = {
  title: 'Subqueries — SlintORM Query Builder',
  description: "SlintORM subqueries — selectSubquery, exists, notExists, whereRaw subqueries, UNION and UNION ALL.",
  alternates: { canonical: '/docs/query-builder/subqueries' },
};

const selectSubquery = `// .selectSubquery(subquery, alias)
// Adds a correlated subquery in the SELECT clause

// Count comments per post inline
const posts = await Post.query()
  .select('id', 'title', 'userId')
  .selectSubquery(
    'SELECT COUNT(*) FROM comments WHERE comments.postId = posts.id',
    'commentCount'
  )
  .get();

// posts[0].commentCount — comment count for that post`;

const existsSubquery = `// .exists(subquery) — WHERE EXISTS (subquery)
// Returns only rows where the subquery returns at least one row

const usersWithPosts = await User.query()
  .exists('SELECT 1 FROM posts WHERE posts.userId = users.id')
  .get();
// Only users who have written at least one post`;

const notExists = `// .notExists(subquery) — WHERE NOT EXISTS (subquery)
const usersWithoutPosts = await User.query()
  .notExists('SELECT 1 FROM posts WHERE posts.userId = users.id')
  .get();
// Users who have never written a post`;

const whereRawSubquery = `// Subquery inside whereRaw with params
// Useful for IN-subquery patterns

const popularPostAuthors = await User.query()
  .whereRaw(
    'id IN (SELECT userId FROM posts WHERE viewCount > ?)',
    [1000]
  )
  .get();

// Users who wrote at least one post with > 1000 views`;

const union = `// AdvancedQueryBuilder.union(queries, all?)
// Static method — combines multiple queries with UNION or UNION ALL

import { AdvancedQueryBuilder } from 'slintorm';

const admins = User.query().where('role', '=', 'admin');
const mods   = User.query().where('role', '=', 'moderator');

// UNION — deduplicates rows
const staff = await AdvancedQueryBuilder.union([admins, mods]);

// UNION ALL — keeps duplicates
const allStaff = await AdvancedQueryBuilder.union([admins, mods], true);`;

const combined = `// Combining selectSubquery + exists + whereRaw
const result = await Post.query()
  .select('id', 'title')
  .selectSubquery(
    'SELECT COUNT(*) FROM comments WHERE comments.postId = posts.id',
    'commentCount'
  )
  .exists('SELECT 1 FROM likes WHERE likes.postId = posts.id')
  .whereRaw('posts.publishedAt IS NOT NULL')
  .orderBy('createdAt', 'DESC')
  .limit(20)
  .get();`;

export default function SubqueriesPage() {
  return (
    <DocLayout>
      <h1 style={{ marginBottom: '0.5rem' }}>Subqueries</h1>
      <p style={{ marginBottom: '2rem', fontSize: '1.05rem' }}>
        SlintORM supports correlated subqueries in SELECT, EXISTS/NOT EXISTS in WHERE,
        and UNION / UNION ALL across multiple queries. All via <code>model.query()</code>.
      </p>

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>selectSubquery</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        Adds a raw SQL subquery to the SELECT clause with an alias. Useful for inline counts or lookups.
      </p>
      <CodeBlock code={selectSubquery} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>exists</h2>
      <CodeBlock code={existsSubquery} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>notExists</h2>
      <CodeBlock code={notExists} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>whereRaw for IN subqueries</h2>
      <CodeBlock code={whereRawSubquery} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>union / union all</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        <code>AdvancedQueryBuilder.union(queries, all?)</code> is a static method.
        Pass an array of query builder instances. <code>all = true</code> uses UNION ALL.
      </p>
      <CodeBlock code={union} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Combined example</h2>
      <CodeBlock code={combined} />
    </DocLayout>
  );
}
