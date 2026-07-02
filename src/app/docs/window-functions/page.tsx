import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';

export const metadata = {
  title: 'Window Functions — SlintORM',
  description: 'SlintORM window function support — ROW_NUMBER, RANK, and analytic queries over partitioned rows.',
  alternates: { canonical: '/docs/window-functions' },
};

const rowNumberBasic = `// window(function, overClause) — fluent window function API
// Available on AdvancedQueryBuilder (.advanced())

const results = await User.query()
  .advanced()
  .window(
    'ROW_NUMBER()',
    'PARTITION BY department ORDER BY salary DESC'
  )
  .get();

// SQL: SELECT *, ROW_NUMBER() OVER (
//        PARTITION BY department ORDER BY salary DESC
//      ) AS row_num FROM users
//
// Each row has a row_num property with the rank within its department`;

const rankFunction = `// RANK() — same rank for ties, gaps in sequence
const ranked = await Product.query()
  .advanced()
  .window(
    'RANK()',
    'PARTITION BY category ORDER BY rating DESC'
  )
  .get();

// SQL: SELECT *, RANK() OVER (
//        PARTITION BY category ORDER BY rating DESC
//      ) AS rank FROM products
//
// Products with the same rating get the same rank (e.g., 1,1,3)`;

const denseRank = `// DENSE_RANK() — same rank for ties, no gaps
const ranked = await Product.query()
  .advanced()
  .window(
    'DENSE_RANK()',
    'PARTITION BY category ORDER BY rating DESC'
  )
  .get();

// Products with the same rating get the same rank (e.g., 1,1,2)
// Unlike RANK(), DENSE_RANK() does not skip numbers`;

const ntile = `// NTILE(n) — distributes rows into n buckets
const quartiles = await Student.query()
  .advanced()
  .window(
    'NTILE(4)',
    'ORDER BY score DESC'
  )
  .get();

// Each row gets a quartile (1-4) based on score
// Useful for percentile-based analysis`;

const runningTotal = `// Running total with SUM() OVER()
const totals = await Order.query()
  .advanced()
  .window(
    'SUM(amount)',
    'PARTITION BY customerId ORDER BY createdAt ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW'
  )
  .get();

// SQL: SELECT *, SUM(amount) OVER (
//        PARTITION BY customerId
//        ORDER BY createdAt
//        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
//      ) AS running_total FROM orders
//
// Each row has a running_total with cumulative sum per customer`;

const lagLead = `// LAG() / LEAD() — access adjacent rows
const withPrev = await Sales.query()
  .advanced()
  .window(
    'LAG(amount, 1, 0)',
    'PARTITION BY productId ORDER BY month ASC'
  )
  .window(
    'LEAD(amount, 1, 0)',
    'PARTITION BY productId ORDER BY month ASC'
  )
  .get();

// Each row has:
//   lag_amount  — previous month's sales (0 if none)
//   lead_amount — next month's sales (0 if none)
// Useful for month-over-month comparison`;

const firstValue = `// FIRST_VALUE() / LAST_VALUE() — first/last in window frame
const withFirst = await Employee.query()
  .advanced()
  .window(
    'FIRST_VALUE(name)',
    'PARTITION BY department ORDER BY hireDate ASC ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING'
  )
  .get();

// Each row has first_hired — the name of the first hired
// employee in the same department`;

const compatibility = `// Driver compatibility notes:
//
// SQLite 3.25+   — Full window function support (ROW_NUMBER, RANK,
//                   DENSE_RANK, NTILE, LAG, LEAD, FIRST_VALUE, etc.)
// PostgreSQL 8.4+ — Full window function support (native)
// MySQL 8.0+     — Full window function support
// MySQL 5.7      — No window function support (emulation required)
// MongoDB        — No window function support (use aggregation pipeline)
//
// Always verify your database version before relying on window functions.
//
// Tip: Use .advanced() to access the window() method
//      const result = await Model.query().advanced().window(...).get();`;

export default function WindowFunctionsPage() {
  return (
    <DocLayout>
      <h1 style={{ marginBottom: '0.5rem' }}>Window Functions</h1>
      <p style={{ marginBottom: '2rem', fontSize: '1.05rem' }}>
        SlintORM supports SQL window functions through the{' '}
        <code>window(function, overClause)</code> method on{' '}
        <code>AdvancedQueryBuilder</code>. Window functions perform
        calculations across a set of rows related to the current row, without
        collapsing them into a group.
      </p>

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>ROW_NUMBER</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        Assigns a unique sequential integer to each row within a partition.
        Useful for pagination, deduplication, and top-N-per-group queries.
      </p>
      <CodeBlock code={rowNumberBasic} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>RANK &amp; DENSE_RANK</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        <code>RANK()</code> assigns the same rank to tied rows but leaves gaps;
        <code>DENSE_RANK()</code> assigns the same rank without gaps.
      </p>
      <CodeBlock code={rankFunction} />
      <CodeBlock code={denseRank} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>NTILE</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        Distributes rows into a specified number of buckets (roughly equal
        size). Useful for percentile-based analysis and decile calculations.
      </p>
      <CodeBlock code={ntile} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Running totals</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        Combine <code>SUM()</code> with <code>OVER()</code> and a frame
        specification to compute cumulative aggregates.
      </p>
      <CodeBlock code={runningTotal} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>LAG / LEAD</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        Access data from previous (<code>LAG</code>) or next ({' '}
        <code>LEAD</code>) rows within the same partition. The third argument
        specifies the default value when no adjacent row exists.
      </p>
      <CodeBlock code={lagLead} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>FIRST_VALUE / LAST_VALUE</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        Returns the first or last value in the window frame. Note that{' '}
        <code>LAST_VALUE</code> requires an explicit frame specification
        (<code>ROWS BETWEEN ...</code>) to behave intuitively.
      </p>
      <CodeBlock code={firstValue} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Driver compatibility</h2>
      <CodeBlock code={compatibility} language="text" />
    </DocLayout>
  );
}
