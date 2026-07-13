import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';

export const metadata = {
  title: 'Column Constraints — SlintORM Annotations',
  description: '@auto, @primaryKey, @unique, @index, @nullable, @not null, @length, @default, @enum, @comment — column-level constraint annotations for SlintORM.',
  alternates: { canonical: '/docs/annotations/constraints' },
};

export default function Page() {
  return (
    <DocLayout>
      <h1>Column Constraint Annotations</h1>
      <p>These annotations control the database column type, constraints, and indexes. They're processed by the schema generator and migrator to produce DDL.</p>

      <h2><code>@auto</code> — Auto-increment</h2>
      <CodeBlock code={`// @auto (SQLite: INTEGER PRIMARY KEY AUTOINCREMENT, Postgres: SERIAL, MySQL: AUTO_INCREMENT)
// @auto;@primaryKey
id: number;`} filename="src/interfaces.ts" />
      <p>Marks the column as auto-incrementing. Typically combined with <code>@primaryKey</code>. The database generates the value on insert; SlintORM never writes to this field.</p>

      <h2><code>@primaryKey</code> — Primary Key</h2>
      <CodeBlock code={`// @auto;@primaryKey
id: number;

// Composite primary key (multiple fields with @primaryKey)
// In a junction table:
userId: number;  // @primaryKey
teamId: number;  // @primaryKey`} filename="src/interfaces.ts" />
      <p>Marks the field as the primary key. Used by <code>.get()</code>, <code>entity.refresh()</code>, <code>entity.update()</code>, and <code>entity.delete()</code> to identify rows. Supports composite keys.</p>

      <h2><code>@unique</code> — Unique Constraint</h2>
      <CodeBlock code={`// @unique
email: string;

// Unique constraint with explicit name (Postgres/MySQL):
// @unique:uq_users_email
email: string;`} filename="src/interfaces.ts" />
      <p>Creates a <code>UNIQUE</code> constraint on the column. Duplicate values throw <code>ORMError.UNIQUE_VIOLATION</code>.</p>

      <h2><code>@index</code> — Database Index</h2>
      <CodeBlock code={`// @index
teamId: number;

// Composite index across multiple fields:
// On the foreign key field:
teamId: number;  // @index;@relation manytoone:Team;foreignKey:teamId`} filename="src/interfaces.ts" />
      <p>Creates a database index on the column. Speeds up queries that filter or sort by this field.</p>

      <h2><code>@nullable</code> / <code>@not null</code> — Nullability</h2>
      <CodeBlock code={`// @nullable — allows NULL values
bio?: string;    // @nullable  (optional fields are nullable by default)

// @not null — explicitly NOT NULL
role: string;    // @not null  (required fields are NOT NULL by default)`} filename="src/interfaces.ts" />
      <p>Controls <code>NULL</code> / <code>NOT NULL</code> in DDL. Generally, TypeScript <code>?</code> optional fields map to <code>@nullable</code>, and required fields map to <code>NOT NULL</code>.</p>

      <h2><code>@length:N</code> — Column Length</h2>
      <CodeBlock code={`// @length:500 — VARCHAR(500) in SQL, TEXT in SQLite
summary: string;`} filename="src/interfaces.ts" />
      <p>Sets <code>VARCHAR(N)</code> for MySQL/Postgres. SQLite ignores length but the migrator still records it.</p>

      <h2><code>@default:value</code> — Default Value</h2>
      <CodeBlock code={`// @default:user
role: string;

// @default:'active'  (quoted strings preserve quotes)
status: string;

// @default:0
count: number;

// @default:CURRENT_TIMESTAMP
createdAt: string;`} filename="src/interfaces.ts" />
      <p>Sets the <code>DEFAULT</code> value in DDL. For string defaults, use single quotes: <code>@default:\'active\'</code>. Raw values (unquoted) are treated as SQL expressions (e.g. <code>CURRENT_TIMESTAMP</code>).</p>

      <h2><code>@enum:(a,b,c)</code> — Enum Constraint</h2>
      <CodeBlock code={`// @enum:(pending,active,banned)
status: string;

// Valid:   "pending", "active", "banned"
// Invalid: "deleted", "archived"`} filename="src/interfaces.ts" />
      <p>Creates a <code>CHECK</code> constraint (SQLite/Postgres) or <code>ENUM</code> type (MySQL). Values outside the enum set throw <code>ORMError.CHECK_VIOLATION</code>.</p>

      <h2><code>@comment:text</code> — Column Comment</h2>
      <CodeBlock code={`// @comment:User's display name (visible in database tools)
name: string;`} filename="src/interfaces.ts" />
      <p>Adds a <code>COMMENT</code> to the column (MySQL/Postgres). Useful for database documentation.</p>

      <h2><code>@softDelete</code> — Soft Delete</h2>
      <CodeBlock code={`// @softDelete
deletedAt: string;

// Queries auto-filter: WHERE deletedAt IS NULL
await User.getAll();              // excludes deleted rows

// Include or filter deleted:
await User.query().withTrashed().get();   // all rows
await User.query().onlyTrashed().get();   // only deleted

// Restore:
await User.restore({ id: 1 });    // sets deletedAt = NULL`} filename="src/interfaces.ts" />
      <p>See the full <a href="/docs/soft-delete">Soft Delete docs</a> for details.</p>

      <h2>Errors</h2>
      <table>
        <thead>
          <tr>
            <th>Error</th>
            <th>Cause</th>
            <th>Fix</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>ORMError: UNIQUE_VIOLATION</code></td>
            <td>Duplicate value in <code>@unique</code> column</td>
            <td>Use <code>upsert()</code> or check before insert</td>
          </tr>
          <tr>
            <td><code>ORMError: CHECK_VIOLATION</code></td>
            <td>Value not in <code>@enum</code> list</td>
            <td>Use one of the listed enum values</td>
          </tr>
          <tr>
            <td><code>ORMError: NOT_NULL_VIOLATION</code></td>
            <td><code>null</code> in a <code>NOT NULL</code> column</td>
            <td>Provide a value or mark as <code>@nullable</code></td>
          </tr>
          <tr>
            <td>No primary key defined</td>
            <td>No field has <code>@primaryKey</code></td>
            <td>Add <code>@primaryKey</code> to at least one field</td>
          </tr>
        </tbody>
      </table>

      <h2>Conventions</h2>
      <ul>
        <li>Always have exactly one <code>@primaryKey</code> field (or a composite primary key)</li>
        <li>Optional fields (<code>?</code> in TypeScript) are implicitly <code>@nullable</code></li>
        <li><code>@auto</code> is only needed for integer primary keys — string UUIDs use <code>@random</code> instead</li>
        <li>Use <code>@unique</code> for business keys (email, slug); use <code>@index</code> for foreign keys</li>
      </ul>
    </DocLayout>
  );
}
