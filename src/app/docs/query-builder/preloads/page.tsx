import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';

export const metadata = {
  title: 'Preloads — SlintORM Query Builder',
  description: "SlintORM preloads — eager loading with no N+1, nested preloads, cycle detection, all 4 relation kinds.",
  alternates: { canonical: '/docs/query-builder/preloads' },
};

const preloadBasic = `// .preload("relation") — eager-load a declared relation
// Batch-fetched in a single IN query — no N+1

const posts = await Post.query()
  .preload('user')   // loads each post's user
  .get();

// posts[0].user is the full User object
console.log(posts[0].user?.name);`;

const preloadOneToMany = `// onetomany — loads child records per parent
// @relation onetomany:Comment;foreignKey:postId

const posts = await Post.query()
  .preload('comments')
  .get();

// posts[0].comments is Comment[]`;

const preloadManyToOne = `// manytoone — loads the parent record
// @relation manytoone:User;foreignKey:userId

const comments = await Comment.query()
  .preload('user')
  .get();

// comments[0].user is the User object`;

const preloadOneToOne = `// onetoone — loads the single related record
// @relationship onetoone:Profile;foreignKey:userId

const users = await User.query()
  .preload('profile')
  .get();

// users[0].profile is Profile | null`;

const preloadManyToMany = `// manytomany — uses a single INNER JOIN on the pivot table
// @relation manytomany:Team;through:team_members;foreignKey:userId;relatedKey:teamId

const users = await User.query()
  .preload('teams')
  .get();

// users[0].teams is Team[]`;

const preloadNested = `// Nested preloads — dot-notation, any depth
const posts = await Post.query()
  .preload('user')           // loads post.user
  .preload('user.profile')   // loads post.user.profile
  .get();

// Cycle detection is built-in — circular chains stop automatically

// Another example: posts with comments and each comment's author
const detailed = await Post.query()
  .preload('comments')
  .preload('comments.user')
  .get();`;

const preloadExclude = `// .exclude() strips columns from preloaded relations
const posts = await Post.query()
  .preload('user')
  .exclude('user.password')
  .exclude('user.secretToken')
  .get();

// posts[0].user exists but has no .password or .secretToken field

// exclude() on root and nested in one chain
const users = await User.query()
  .preload('posts')
  .preload('posts.comments')
  .exclude('password')          // root User
  .exclude('posts.body')        // strip from Post
  .exclude('posts.comments.ip') // strip from nested Comment
  .get();`;

export default function PreloadsPage() {
  return (
    <DocLayout>
      <h1 style={{ marginBottom: '0.5rem' }}>Preloads</h1>
      <p style={{ marginBottom: '2rem', fontSize: '1.05rem' }}>
        <code>.preload("relation")</code> eager-loads related records declared in your model annotations.
        All four relation kinds are supported. Records are batch-fetched with a single IN query per relation — no N+1.
      </p>

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Basic preload</h2>
      <CodeBlock code={preloadBasic} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>One-to-many</h2>
      <CodeBlock code={preloadOneToMany} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Many-to-one</h2>
      <CodeBlock code={preloadManyToOne} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>One-to-one</h2>
      <CodeBlock code={preloadOneToOne} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Many-to-many</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        Many-to-many relations fetch pivot data in a single INNER JOIN query against the through table.
      </p>
      <CodeBlock code={preloadManyToMany} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Nested preloads</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        Use dot-notation to preload at any depth. Cycle detection prevents infinite loops.
      </p>
      <CodeBlock code={preloadNested} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>exclude() on preloads</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        Strip sensitive columns from root or any nested preloaded relation using dot-notation in <code>exclude()</code>.
      </p>
      <CodeBlock code={preloadExclude} />

      <div style={{
        background: 'rgba(34, 197, 94, 0.08)',
        border: '1px solid rgba(34, 197, 94, 0.2)',
        borderRadius: '8px',
        padding: '1rem 1.25rem',
        marginTop: '2rem',
        fontSize: '0.875rem',
      }}>
        <strong style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-mono)' }}>How batching works</strong>
        <p style={{ marginTop: '0.25rem', color: 'var(--color-fg-muted)' }}>
          For a one-to-many preload, SlintORM collects all parent IDs from the root query result,
          then fires one <code>WHERE id IN (...)</code> query and distributes records back to their parents.
          This means N posts with comments = 2 queries total, not N+1.
        </p>
      </div>
    </DocLayout>
  );
}
