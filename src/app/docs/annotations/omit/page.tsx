import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';

export const metadata = {
  title: '@omit family — SlintORM Annotations',
  description: '@omitdb (no column), @omitjson (strip from reads), @omitmigrate (manual DDL) — visibility and storage control for SlintORM.',
  alternates: { canonical: '/docs/annotations/omit' },
};

export default function Page() {
  return (
    <DocLayout>
      <h1><code>@omitdb / @omitjson / @omitmigrate</code></h1>
      <p>Three annotations that control whether a field is stored, serialized, or managed by the migrator.</p>

      <h2>Reference</h2>
      <table>
        <thead>
          <tr>
            <th>Annotation</th>
            <th>Stored in DB</th>
            <th>Returned in reads</th>
            <th>Managed by migrator</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>@omitdb</code></td>
            <td>No (excluded from INSERT SET, no column)</td>
            <td>No</td>
            <td>N/A</td>
          </tr>
          <tr>
            <td><code>@omitjson</code></td>
            <td>Yes</td>
            <td>No (unless explicitly <code>.select()</code>ed)</td>
            <td>Yes</td>
          </tr>
          <tr>
            <td><code>@omitmigrate</code></td>
            <td>Depends on manual DDL</td>
            <td>Yes</td>
            <td>No (skips column in CREATE/ALTER)</td>
          </tr>
        </tbody>
      </table>

      <h2><code>@omitdb</code> — No Database Column</h2>
      <p>The field exists only at the type level. It's excluded from INSERT SET clauses and never stored. Useful for computed fields, transient data, or columns managed externally.</p>
      <CodeBlock code={`// @omitdb
internalNote?: string;  // TS-only field

const user = await User.insert({
  name: "Alice",
  internalNote: "secret",
});
console.log(user.internalNote); // undefined (excluded from insert)
// The column does NOT exist in the database table`} filename="src/interfaces.ts" />

      <h2><code>@omitjson</code> — Strip from Reads</h2>
      <p>The field IS stored in the database but stripped from all read results unless explicitly selected. Useful for internal audit data, system fields, or values only needed for backend processing.</p>
      <CodeBlock code={`// @omitjson
auditData?: string;  // stored but hidden from reads

const user = await User.insert({ name: "Alice", auditData: "created-by-admin" });
console.log(user.auditData); // undefined (stripped)

// Explicit .select() returns it:
const withAudit = await User.query()
  .select("name", "auditData")
  .where("name", "=", "Alice")
  .get();
console.log(withAudit[0].auditData); // "created-by-admin"

// Raw SQL confirms it's stored:
const raw = await orm.execRaw("SELECT auditData FROM users WHERE name = ?", ["Alice"]);
console.log(raw.rows[0].auditData); // "created-by-admin"`} filename="src/interfaces.ts" />

      <h2><code>@omitmigrate</code> — Skip Migrator</h2>
      <p>The migrator ignores this column during <code>migrate()</code> — it won't create, alter, or drop it. You manage the DDL manually. The field is still usable in queries.</p>
      <CodeBlock code={`// @omitmigrate
tempField?: string;  // manual DDL only

// After migrate(), no column exists for tempField.
// You must CREATE it manually:
await orm.execRaw("ALTER TABLE users ADD COLUMN tempField TEXT");`} filename="src/interfaces.ts" />

      <h2>Errors</h2>
      <table>
        <thead>
          <tr>
            <th>Issue</th>
            <th>Cause</th>
            <th>Fix</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>@omitdb field visible in query result</td>
            <td>Misconfiguration or cache</td>
            <td>Regenerate schema and verify the annotation is on the correct field</td>
          </tr>
          <tr>
            <td>@omitmigrate column created by migrate()</td>
            <td>The migrator version may not support @omitmigrate</td>
            <td>Update to SlintORM v1.5+</td>
          </tr>
        </tbody>
      </table>

      <h2>Conventions</h2>
      <ul>
        <li><code>@omitdb</code> is for fields that should never touch the database (computed, transient, external-managed)</li>
        <li><code>@omitjson</code> is for fields that live in the DB but should be hidden from API responses</li>
        <li><code>@omitmigrate</code> is for legacy columns or DB-native features (triggers, generated columns)</li>
        <li><code>@secret</code> internally applies <code>@omitjson</code> — you don't need both</li>
      </ul>

      <h2>See also</h2>
      <ul>
        <li><a href="/docs/annotations/secret"><code>@secret</code> — @hash + @omitjson composite</a></li>
      </ul>
    </DocLayout>
  );
}
