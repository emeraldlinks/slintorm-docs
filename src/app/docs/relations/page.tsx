import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';

export const metadata = { title: 'Relations — SlintORM' };

const oneToMany = `// One-to-Many: User has many Posts
// Annotation goes on the parent side

interface User {
  id: number;
  name: string;
  // @relation onetomany:Post;foreignKey:userId
  posts?: Post[];
}

interface Post {
  id: number;
  title: string;
  userId: number;
  // @relation manytoone:User;foreignKey:userId
  user?: User;
}

// Preload posts with their users:
const users = await User.query()
  .preload('posts')
  .get();
// users[0].posts -> Post[]`;

const manyToOne = `// Many-to-One: Post belongs to User
// Annotation goes on the child side (same field as foreignKey)

interface Comment {
  id: number;
  body: string;
  // @index
  postId: number;
  // @relation manytoone:Post;foreignKey:postId
  post?: Post;
}

// Preload comments with their post:
const comments = await Comment.query()
  .preload('post')
  .get();
// comments[0].post -> Post`;

const oneToOne = `// One-to-One: User has one Profile
// Use @relationship (alias for @relation)

interface User {
  id: number;
  email: string;
  // @relationship onetoone:Profile;foreignKey:userId
  profile?: Profile;
}

interface Profile {
  id: number;
  // @unique
  userId: number;
  // @nullable
  bio: string;
  // @nullable
  avatarUrl: string;
  // @relationship onetoone:User;foreignKey:userId;onDelete:CASCADE
  user?: User;
}

// Preload profile with user:
const user = await User.get({ id: 1 });
const withProfile = await User.query()
  .where('id', '=', 1)
  .preload('profile')
  .first();
// withProfile.profile -> Profile`;

const manyToMany = `// Many-to-Many: User belongs to many Teams
// Requires a pivot table — auto-synthesized at migrate time

interface User {
  id: number;
  name: string;
  // @relation manytomany:Team;through:team_members;foreignKey:userId;relatedKey:teamId
  teams?: Team[];
}

interface Team {
  id: number;
  name: string;
  // @relation manytomany:User;through:team_members;foreignKey:teamId;relatedKey:userId
  members?: User[];
}

// SlintORM creates team_members(userId, teamId) pivot table on migrate()

// Preload team members:
const teams = await Team.query()
  .preload('members')
  .get();
// teams[0].members -> User[]

// Preload user's teams:
const user = await User.query()
  .where('id', '=', 42)
  .preload('teams')
  .first();
// user.teams -> Team[]`;

const onDelete = `// onDelete options: CASCADE | SET NULL

interface Post {
  id: number;
  // @relation manytoone:User;foreignKey:userId;onDelete:CASCADE
  userId: number;
  // Deleting the user deletes their posts too
}

interface Comment {
  id: number;
  // @relation manytoone:Post;foreignKey:postId;onDelete:SET NULL
  postId: number | null;
  // Deleting the post sets postId to NULL
}`;

const relAnnotation = `// Both @relation and @relationship are supported
// They are exact aliases — use whichever reads more naturally

// These are identical:
// @relation onetomany:Comment;foreignKey:postId
// @relationship onetomany:Comment;foreignKey:postId

// Annotation syntax breakdown:
// @relation <kind>:<ModelName>;foreignKey:<column>[;relatedKey:<col>][;onDelete:<CASCADE|SET NULL>]
// kind: onetomany | manytoone | onetoone | manytomany`;

export default function RelationsPage() {
  return (
    <DocLayout>
      <h1 style={{ marginBottom: '0.5rem' }}>Relations</h1>
      <p style={{ marginBottom: '2rem', fontSize: '1.05rem' }}>
        Relations are declared in <code>// comment</code> annotations above interface fields.
        SlintORM reads these at migration time to create foreign keys and pivot tables,
        and at query time to resolve <code>preload()</code>, <code>throughRelation()</code>, and <code>relatedTo()</code>.
      </p>

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>One-to-Many</h2>
      <CodeBlock code={oneToMany} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Many-to-One</h2>
      <CodeBlock code={manyToOne} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>One-to-One</h2>
      <CodeBlock code={oneToOne} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Many-to-Many</h2>
      <p style={{ marginBottom: '0.75rem' }}>
        The pivot table named in <code>through:</code> is created automatically during migration.
        Declare the relation on both sides to make it bidirectional.
      </p>
      <CodeBlock code={manyToMany} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>onDelete options</h2>
      <CodeBlock code={onDelete} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Annotation syntax</h2>
      <CodeBlock code={relAnnotation} />
    </DocLayout>
  );
}
