import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';

export const metadata = { title: 'where() — SlintORM Query Builder' };

const whereBasic = `// where(column, op, value)
const admins = await User.query()
  .where('role', '=', 'admin')
  .get();

// All OpComparison operators:
// = != < <= > >= LIKE ILIKE`;

const whereChained = `// Chained .where() calls are AND-ed together
const results = await User.query()
  .where('role', '=', 'admin')
  .where('active', '=', true)
  .where('createdAt', '>', '2024-01-01')
  .get();
// WHERE role = 'admin' AND active = 1 AND createdAt > '2024-01-01'`;

const orWhere = `// .orWhere(column, op, value) — OR connector
const results = await User.query()
  .where('role', '=', 'admin')
  .orWhere('role', '=', 'superuser')
  .get();
// WHERE role = 'admin' OR role = 'superuser'`;

const whereRaw = `// .whereRaw(sql, params?) — parameterized raw SQL
// params is optional (BUG FIX #3: now correctly accepts 2nd arg)
const results = await User.query()
  .whereRaw('LOWER(email) = ?', ['joe@example.com'])
  .get();

// No params:
const results2 = await Post.query()
  .whereRaw('publishedAt IS NOT NULL')
  .get();`;

const whereIn = `// .whereIn(column, values[])
const users = await User.query()
  .whereIn('role', ['admin', 'superuser', 'moderator'])
  .get();

// .whereNotIn(column, values[])
const others = await User.query()
  .whereNotIn('status', ['banned', 'suspended'])
  .get();`;

const whereNull = `// .whereNull(column)
const unverified = await User.query()
  .whereNull('verifiedAt')
  .get();

// .whereNotNull(column)
const verified = await User.query()
  .whereNotNull('verifiedAt')
  .get();`;

const whereBetween = `// .whereBetween(column, min, max)
const recentPosts = await Post.query()
  .whereBetween('createdAt', '2024-01-01', '2024-12-31')
  .get();

const midRange = await Product.query()
  .whereBetween('price', 100, 500)
  .get();`;

const ilike = `// .ILike(column, pattern) — case-insensitive LIKE
// SQLite: LIKE (already case-insensitive for ASCII)
// Postgres: ILIKE
// MySQL: LIKE (case-insensitive by default collation)

const matches = await User.query()
  .ILike('name', '%joe%')
  .get();
// Finds "Joe", "JOEY", "joe smith", etc.`;

const dotNotation = `// Dot-notation: "table.column" after a manual join
// avoids ambiguity on shared column names

const posts = await Post.query()
  .join('users', 'posts.userId', '=', 'users.id')
  .where('users.role', '=', 'admin')  // qualifies to users table
  .get();

// Without a join, bare "column" targets the root table`;

const ops = [
  { op: '=', desc: 'Equals' },
  { op: '!=', desc: 'Not equals' },
  { op: '<', desc: 'Less than' },
  { op: '<=', desc: 'Less than or equal' },
  { op: '>', desc: 'Greater than' },
  { op: '>=', desc: 'Greater than or equal' },
  { op: 'LIKE', desc: 'Pattern match (case-sensitive, use % wildcard)' },
  { op: 'ILIKE', desc: 'Case-insensitive pattern match (use .ILike() method)' },
];

export default function WherePage() {
  return (
    <DocLayout>
      <h1 style={{ marginBottom: '0.5rem' }}>where()</h1>
      <p style={{ marginBottom: '2rem', fontSize: '1.05rem' }}>
        The query builder exposes a full set of WHERE clause builders.
        All methods are chainable. Multiple <code>where()</code> calls are AND-ed.
      </p>

      <h2 style={{ marginBottom: '1rem', marginTop: '2rem' }}>Operators (OpComparison)</h2>
      <div style={{ border: '1px solid var(--color-border)', borderRadius: '10px', overflow: 'hidden', marginBottom: '2rem' }}>
        <table>
          <thead>
            <tr>
              <th>Operator</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {ops.map(o => (
              <tr key={o.op}>
                <td><code>{o.op}</code></td>
                <td style={{ color: 'var(--color-fg-subtle)' }}>{o.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>where(column, op, value)</h2>
      <CodeBlock code={whereBasic} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Chained where (AND)</h2>
      <CodeBlock code={whereChained} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>orWhere</h2>
      <CodeBlock code={orWhere} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>whereRaw</h2>
      <CodeBlock code={whereRaw} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>whereIn / whereNotIn</h2>
      <CodeBlock code={whereIn} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>whereNull / whereNotNull</h2>
      <CodeBlock code={whereNull} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>whereBetween</h2>
      <CodeBlock code={whereBetween} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>ILike (case-insensitive LIKE)</h2>
      <CodeBlock code={ilike} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Dot-notation for joined tables</h2>
      <CodeBlock code={dotNotation} />
    </DocLayout>
  );
}
