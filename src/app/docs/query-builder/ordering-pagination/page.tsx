import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';

export const metadata = { title: 'Ordering & Pagination — SlintORM Query Builder' };

const orderBy = `// .orderBy(column, direction)
// direction: 'ASC' | 'DESC'

const recent = await Post.query()
  .orderBy('createdAt', 'DESC')
  .get();

// Multiple orderBy — applied in order
const sorted = await User.query()
  .orderBy('role', 'ASC')
  .orderBy('name', 'ASC')
  .get();`;

const limitOffset = `// .limit(n) — max rows returned
// .offset(n) — skip N rows

const page2 = await Post.query()
  .orderBy('createdAt', 'DESC')
  .limit(10)
  .offset(10)   // skip first 10
  .get();`;

const paginate = `// .paginate(page, perPage) — shorthand for limit/offset
// page is 1-indexed

const posts = await Post.query()
  .orderBy('createdAt', 'DESC')
  .paginate(3, 20)  // page 3, 20 per page
  .get();
// Equivalent to: .limit(20).offset(40)`;

const getPaginated = `// .getPaginated(page, perPage)
// Returns { data, total, page, lastPage }

const result = await Post.query()
  .where('published', '=', true)
  .orderBy('createdAt', 'DESC')
  .getPaginated(1, 10);

console.log(result.data);      // Post[] for this page
console.log(result.total);     // total matching rows
console.log(result.page);      // current page number
console.log(result.lastPage);  // Math.ceil(total / perPage)

// Using in an API route:
// GET /api/posts?page=2&limit=20
const page = parseInt(req.query.page as string) || 1;
const limit = parseInt(req.query.limit as string) || 20;
const { data, total, lastPage } = await Post.query()
  .where('published', '=', true)
  .orderBy('createdAt', 'DESC')
  .getPaginated(page, limit);`;

const first = `// .first(condition?) — return first matching row
// condition can be a raw SQL string or partial filter object

// No condition — first row in natural order
const latest = await Post.query()
  .orderBy('createdAt', 'DESC')
  .first();

// String condition (raw SQL)
const active = await User.query()
  .first('role = "admin"');

// Filter object (partial match)
const admin = await User.query()
  .orderBy('createdAt', 'ASC')
  .first({ role: 'admin' });`;

export default function OrderingPaginationPage() {
  return (
    <DocLayout>
      <h1 style={{ marginBottom: '0.5rem' }}>Ordering & Pagination</h1>
      <p style={{ marginBottom: '2rem', fontSize: '1.05rem' }}>
        SlintORM provides <code>orderBy</code>, <code>limit</code>, <code>offset</code>,
        <code>paginate</code>, and <code>getPaginated</code> for controlled result sets.
      </p>

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>orderBy</h2>
      <CodeBlock code={orderBy} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>limit / offset</h2>
      <CodeBlock code={limitOffset} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>paginate</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        Shorthand that converts a 1-indexed page number and per-page count into <code>LIMIT / OFFSET</code>.
      </p>
      <CodeBlock code={paginate} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>getPaginated</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        Returns a paginated result object with total count and last page number. Runs two queries internally:
        one for the data, one for the total count.
      </p>
      <CodeBlock code={getPaginated} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>first</h2>
      <CodeBlock code={first} />
    </DocLayout>
  );
}
