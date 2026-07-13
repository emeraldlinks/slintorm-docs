import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';

export const metadata = {
  title: '@json — SlintORM Annotations',
  description: 'JSON column serialization annotation for SlintORM — auto-stringify on write, auto-parse on read, nested object support.',
  alternates: { canonical: '/docs/annotations/json' },
};

export default function Page() {
  return (
    <DocLayout>
      <h1><code>@json</code> — JSON Column Serialization</h1>
      <p>Automatically serializes JavaScript objects to JSON strings on write and parses them back on read. The column type is <code>TEXT</code> (or equivalent) in all databases.</p>

      <h2>Syntax</h2>
      <CodeBlock code={`// @json
meta?: Record<string, unknown>;
settings?: Record<string, unknown>;`} filename="src/interfaces.ts" />

      <h2>Usage</h2>
      <CodeBlock code={`const user = await User.insert({
  name: "Alice",
  meta: { theme: "dark", notifications: true, score: 42, tags: ["orm", "typescript"] },
});
console.log(user.meta.theme);  // "dark"
console.log(user.meta.tags);   // ["orm", "typescript"]

// Fetch — auto-parsed back to object
const fetched = await User.get({ id: user.id });
console.log(fetched.meta.theme);  // "dark"
console.log(fetched.meta.tags[0]);// "orm"`} filename="src/auth.ts" />

      <h2>Nested Objects & Partial Updates</h2>
      <CodeBlock code={`// Deep nesting works
await user.update({ meta: { nested: { a: 1, b: [2, 3] } } });
const updated = await User.get({ id: user.id });
console.log(updated.meta.nested.b); // [2, 3]

// ⚠️ Partial update replaces the ENTIRE object
await User.update({ id: user.id }, { meta: { theme: "light" } });
// Result: meta = { theme: "light" } — nested and score are GONE

// Use instance update for merge behavior:
await user.update({ meta: { ...user.meta, score: 99 } });`} filename="src/auth.ts" />

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
            <td><code>Invalid JSON in column "meta"</code></td>
            <td>Stored value is not valid JSON</td>
            <td>Manually fix the database value or use raw SQL to update</td>
          </tr>
          <tr>
            <td>Field returns <code>null</code> instead of object</td>
            <td>Column contains SQL <code>NULL</code></td>
            <td>Set a default value in the interface: <code>meta?: Record&lt;string, unknown&gt; = {}</code></td>
          </tr>
        </tbody>
      </table>

      <h2>Conventions</h2>
      <ul>
        <li>Use <code>Record&lt;string, unknown&gt;</code> for flexible objects, or a typed interface for structured data</li>
        <li><strong>update() replaces the entire JSON column</strong> — always spread existing values if you want to preserve fields</li>
        <li>Use instance <code>.update()</code> if you want to merge new fields with existing ones programmatically</li>
        <li>JSON columns are not indexed by default — use <code>@index</code> if you need to query on JSON paths</li>
        <li>Inferred models (without schema) auto-detect <code>Record&lt;string, unknown&gt;</code> fields as JSON</li>
      </ul>
    </DocLayout>
  );
}
