import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';

export const metadata = {
  title: 'Relation Traversal — SlintORM Query Builder',
  description: "SlintORM relation traversal — throughRelation, whereRelated, relatedTo with BFS path discovery.",
  alternates: { canonical: '/docs/query-builder/relation-traversal' },
};

const throughRelation = `// .throughRelation(path)
// Dot-separated path of relation names
// Auto-generates JOINs from schema metadata — no manual ON clauses

// Get assessments taken by a specific student
// Path: enrollments -> assessments (via enrollment relation)
const assessments = await Assessment.query()
  .throughRelation('enrollment.student')
  .where('students.id', '=', 42)
  .get();

// SlintORM reads your @relation annotations and builds:
// INNER JOIN enrollments ON enrollments.assessmentId = assessments.id
// INNER JOIN students ON students.id = enrollments.studentId`;

const whereRelated = `// .whereRelated(path, column, value)
// Combines throughRelation with an IN-subquery resolution
// Cleaner than building joins manually for filter-by-relation patterns

const assessments = await Assessment.query()
  .whereRelated('enrollment.student', 'id', 42)
  .get();
// WHERE assessments.id IN (
//   SELECT assessmentId FROM enrollments
//   WHERE studentId IN (SELECT id FROM students WHERE id = 42)
// )`;

const relatedTo = `// .relatedTo(targetModelName, column, value)
// BFS — automatically discovers the shortest path between
// the current model and the target model through the relation graph

// No need to know the path — SlintORM finds it
const assessments = await Assessment.query()
  .relatedTo('Student', 'id', 42)
  .get();

// SlintORM discovers: Assessment -> Enrollment -> Student
// and builds the appropriate subquery chain`;

const comparison = `// All three methods solving the same problem:
// "Get assessments for student with id = 42"

// 1. throughRelation — explicit path, generates JOINs
const a = await Assessment.query()
  .throughRelation('enrollment.student')
  .where('students.id', '=', 42)
  .get();

// 2. whereRelated — explicit path, generates IN subquery
const b = await Assessment.query()
  .whereRelated('enrollment.student', 'id', 42)
  .get();

// 3. relatedTo — BFS path discovery, most declarative
const c = await Assessment.query()
  .relatedTo('Student', 'id', 42)
  .get();`;

const realWorld = `// relatedTo in a real-world scenario:
// Find all posts by users who belong to a given team

const teamPosts = await Post.query()
  .relatedTo('Team', 'id', teamId)
  .where('published', '=', true)
  .orderBy('createdAt', 'DESC')
  .get();

// SlintORM BFS finds: Post -> User -> team_members -> Team
// and builds the appropriate JOIN or subquery chain

// whereRelated for the same query with explicit path:
const teamPosts2 = await Post.query()
  .whereRelated('user.teams', 'id', teamId)
  .where('published', '=', true)
  .get();`;

export default function RelationTraversalPage() {
  return (
    <DocLayout>
      <h1 style={{ marginBottom: '0.5rem' }}>Relation Traversal</h1>
      <p style={{ marginBottom: '2rem', fontSize: '1.05rem' }}>
        SlintORM provides three methods for filtering across relations without writing manual JOIN SQL.
        All three read from your <code>@relation</code> annotations to generate queries automatically.
      </p>

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>throughRelation(path)</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        Takes a dot-separated path of relation names and auto-generates INNER JOINs from schema metadata.
        You still apply the final <code>.where()</code> on the joined table column.
      </p>
      <CodeBlock code={throughRelation} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>whereRelated(path, column, value)</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        Combines <code>throughRelation</code> with an IN-subquery resolution.
        Cleaner than building joins manually for filter-by-relation patterns.
      </p>
      <CodeBlock code={whereRelated} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>relatedTo(targetModelName, column, value)</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        The most declarative option. Uses BFS to automatically discover the shortest relation path
        between the current model and the named target model. You don't need to know the path.
      </p>
      <CodeBlock code={relatedTo} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Side-by-side comparison</h2>
      <CodeBlock code={comparison} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Real-world examples</h2>
      <CodeBlock code={realWorld} />

      <div style={{
        background: 'rgba(59, 130, 246, 0.08)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        borderRadius: '8px',
        padding: '1rem 1.25rem',
        marginTop: '2rem',
        fontSize: '0.875rem',
      }}>
        <strong style={{ color: '#60A5FA', fontFamily: 'var(--font-mono)' }}>When to use which</strong>
        <p style={{ marginTop: '0.25rem', color: 'var(--color-fg-muted)' }}>
          Use <code>relatedTo</code> when you want maximum simplicity and the relation graph is well-defined.
          Use <code>whereRelated</code> when you need an explicit path (e.g. two possible paths exist).
          Use <code>throughRelation</code> when you need the joined table columns accessible in <code>where()</code> or <code>select()</code>.
        </p>
      </div>
    </DocLayout>
  );
}
