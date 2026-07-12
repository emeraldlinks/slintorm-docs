import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';

export const metadata = {
  title: 'Aggregates — SlintORM Query Builder',
  description: "SlintORM advanced query builder — countAggregate, sum, avg, min, max, groupBy, having, distinct, window functions.",
  alternates: { canonical: '/docs/query-builder/aggregates' },
};

const countAggregate = `// .countAggregate() — adds COUNT(*) AS count to SELECT
// Different from ModelAPI.count() which returns a scalar number

const result = await Post.query()
  .countAggregate()
  .groupBy('userId')
  .get();

// result[0].count — number of posts per user
result.forEach(row => {
  console.log(\`User \${row.userId}: \${row.count} posts\`);
});`;

const sumAvg = `// .sum(column) / .avg(column)
// Returns rows with the aggregate value added

const totals = await Order.query()
  .sum('amount')
  .groupBy('userId')
  .get();

// totals[0].sum_amount

const avgRatings = await Review.query()
  .avg('rating')
  .groupBy('productId')
  .get();

// avgRatings[0].avg_rating`;

const minMax = `// .min(column) / .max(column)

const extremes = await Product.query()
  .min('price')
  .max('price')
  .groupBy('categoryId')
  .get();

// extremes[0].min_price
// extremes[0].max_price`;

const groupBy = `// .groupBy(...columns)
const postCounts = await Post.query()
  .select('userId')
  .countAggregate()
  .groupBy('userId')
  .orderBy('count', 'DESC')
  .get();`;

const having = `// .having(rawSql, params?)
// Filters groups after aggregation

const activeUsers = await Post.query()
  .select('userId')
  .countAggregate()
  .groupBy('userId')
  .having('COUNT(*) > ?', [5])  // only users with more than 5 posts
  .get();`;

const distinct = `// .distinct(...columns) — SELECT DISTINCT

const roles = await User.query()
  .distinct('role')
  .get();
// Returns unique role values

const pairs = await Post.query()
  .distinct('userId', 'categoryId')
  .get();`;

const windowFn = `// .window(fn, over) — window function expression
// Added to SELECT as: fn OVER (over) AS window_result

const ranked = await Post.query()
  .select('id', 'title', 'userId', 'createdAt')
  .window(
    'ROW_NUMBER()',
    'PARTITION BY userId ORDER BY createdAt DESC'
  )
  .get();

// ranked[0].window_result — row number within each user partition

// Running total example
const runningTotal = await Order.query()
  .select('id', 'userId', 'amount', 'createdAt')
  .window(
    'SUM(amount)',
    'PARTITION BY userId ORDER BY createdAt'
  )
  .get();`;

export default function AggregatesPage() {
  return (
    <DocLayout>
      <h1 style={{ marginBottom: '0.5rem' }}>Aggregates</h1>
      <p style={{ marginBottom: '2rem', fontSize: '1.05rem' }}>
        Aggregate methods are available via <code>model.query()</code> which returns an
        <code>AdvancedQueryBuilder&lt;T&gt;</code>. This extends the base query builder with
        <code>countAggregate</code>, <code>sum</code>, <code>avg</code>, <code>min</code>,
        <code>max</code>, <code>groupBy</code>, <code>having</code>, <code>distinct</code>,
        and <code>window</code>.
      </p>

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>countAggregate</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        Adds <code>COUNT(*) AS count</code> to the SELECT clause. Different from
        <code>ModelAPI.count()</code> which runs a standalone COUNT query returning a scalar.
      </p>
      <CodeBlock code={countAggregate} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>sum / avg</h2>
      <CodeBlock code={sumAvg} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>min / max</h2>
      <CodeBlock code={minMax} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>groupBy</h2>
      <CodeBlock code={groupBy} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>having</h2>
      <CodeBlock code={having} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>distinct</h2>
      <CodeBlock code={distinct} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>window functions</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        <code>.window(fn, over)</code> adds a window function expression to the SELECT.
        The result appears as <code>window_result</code> on each row.
        Supported by Postgres and MySQL; SQLite has limited window support.
      </p>
      <CodeBlock code={windowFn} />
    </DocLayout>
  );
}
