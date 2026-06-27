import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';

export const metadata = { title: 'Models — SlintORM' };

const userModel = `// src/models.ts

interface User {
  id: number;           // @auto @primaryKey
  // @unique
  email: string;
  name: string;
  // @nullable
  bio: string;
  // @default:user
  role: string;
  // @json
  settings: Record<string, unknown>;
  // @softDelete
  deletedAt: string;
  createdAt: string;    // injected automatically
  updatedAt: string;    // injected automatically
}`;

const postModel = `interface Post {
  id: number;           // @auto @primaryKey
  title: string;
  // @length:5000
  body: string;
  // @default:false
  published: boolean;
  // @index
  userId: number;
  // @relation manytoone:User;foreignKey:userId
  user?: User;
  // @relation onetomany:Comment;foreignKey:postId
  comments?: Comment[];
}`;

const teamModel = `interface Team {
  id: number;           // @auto @primaryKey
  name: string;
  // @relation manytomany:User;through:team_members;foreignKey:teamId;relatedKey:userId
  members?: User[];
}`;

const profileModel = `interface Profile {
  id: number;           // @auto @primaryKey
  // @unique
  userId: number;
  // @nullable
  avatarUrl: string;
  // @relationship onetoone:User;foreignKey:userId;onDelete:CASCADE
  user?: User;
}`;

const enumModel = `interface Todo {
  id: number;           // @auto @primaryKey
  title: string;
  // @enum:(pending,in_progress,done)
  status: string;
  // @not null
  priority: number;
}`;

const metaTags = [
  { tag: '@auto', effect: 'AUTOINCREMENT / SERIAL primary key' },
  { tag: '@primaryKey', effect: 'Marks field as primary key' },
  { tag: '@unique', effect: 'Adds UNIQUE constraint' },
  { tag: '@index', effect: 'Creates an index on this column' },
  { tag: '@nullable', effect: 'Allows NULL values' },
  { tag: '@not null', effect: 'Adds NOT NULL constraint (explicit)' },
  { tag: '@length:N', effect: 'Sets VARCHAR(N) column length' },
  { tag: '@json', effect: 'Stores value as JSON string (TEXT column)' },
  { tag: '@softDelete', effect: 'Marks deletedAt as soft-delete column; queries auto-filter deleted rows' },
  { tag: '@enum:(a,b,c)', effect: 'CHECK constraint (SQLite/Postgres) or ENUM type (MySQL)' },
  { tag: '@default:value', effect: 'Sets column DEFAULT value' },
  { tag: '@comment:text', effect: 'Adds column comment (MySQL/Postgres)' },
  { tag: '@relation ...', effect: 'Declares a relation. See Relations page.' },
  { tag: '@relationship ...', effect: 'Alias for @relation' },
];

export default function ModelsPage() {
  return (
    <DocLayout>
      <h1 style={{ marginBottom: '0.5rem' }}>Models</h1>
      <p style={{ marginBottom: '2rem', fontSize: '1.05rem' }}>
        A model is a plain TypeScript interface. Annotations in line comments above each field
        control column types, constraints, and relations. No separate schema file needed.
      </p>

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Basic model</h2>
      <CodeBlock code={userModel} filename="src/models.ts" />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2.5rem' }}>Relations</h2>
      <CodeBlock code={postModel} filename="src/models.ts" />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Many-to-many</h2>
      <CodeBlock code={teamModel} filename="src/models.ts" />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>One-to-one</h2>
      <CodeBlock code={profileModel} filename="src/models.ts" />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Enum fields</h2>
      <CodeBlock code={enumModel} filename="src/models.ts" />

      <h2 style={{ marginBottom: '1rem', marginTop: '2.5rem' }}>Field metadata reference</h2>
      <p style={{ marginBottom: '1.5rem' }}>
        Annotations go in a <code>// comment</code> on the line directly above the field.
        Both <code>@</code>-prefixed and bare variants are supported by the migrator.
      </p>
      <div style={{ border: '1px solid var(--color-border)', borderRadius: '10px', overflow: 'hidden' }}>
        <table>
          <thead>
            <tr>
              <th>Annotation</th>
              <th>Effect</th>
            </tr>
          </thead>
          <tbody>
            {metaTags.map(t => (
              <tr key={t.tag}>
                <td><code>{t.tag}</code></td>
                <td style={{ color: 'var(--color-fg-subtle)' }}>{t.effect}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{
        background: 'rgba(59, 130, 246, 0.08)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        borderRadius: '8px',
        padding: '1rem 1.25rem',
        marginTop: '2rem',
        fontSize: '0.875rem',
      }}>
        <strong style={{ color: '#60A5FA', fontFamily: 'var(--font-mono)' }}>Automatic columns</strong>
        <p style={{ marginTop: '0.25rem', color: 'var(--color-fg-muted)' }}>
          <code>createdAt</code> and <code>updatedAt</code> are injected into every table automatically.
          <code>deletedAt</code> is only added when a field is annotated with <code>@softDelete</code>.
          You don't need to declare these unless you want to customize their behavior.
        </p>
      </div>
    </DocLayout>
  );
}
