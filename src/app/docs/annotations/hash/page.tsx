import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';

export const metadata = {
  title: '@hash — SlintORM Annotations',
  description: 'PBKDF2 one-way hashing annotation for SlintORM — .verify() for constant-time comparison, per-field iteration override, and gotchas.',
  alternates: { canonical: '/docs/annotations/hash' },
};

export default function Page() {
  return (
    <DocLayout>
      <h1><code>@hash</code> — PBKDF2 Hashing</h1>
      <p>One-way hashes a string field using PBKDF2 with SHA-256 before writing to the database. Exposes a <code>.verify(plaintext)</code> method for constant-time comparison on read.</p>

      <h2>Syntax</h2>
      <CodeBlock code={`// @hash
password?: string;

// With custom iteration count (default: 600000)
// @hash:(iterations=1000000)
pinHash?: string;`} filename="src/interfaces.ts" />

      <h2>Stored Format</h2>
      <CodeBlock code={`pbkdf2$<iterations>$<salt>$<hash>
// Example:
pbkdf2$600000$Ys0HFPkNgc1aGRp6Y8reug==$uWLzg3CQtcDZ37JGoVGyor8Qg7yh9BU9sM2jTdilCN0=`} filename="(database column value)" />

      <ul>
        <li><strong>iterations</strong> — encoded inline so raising the constant never invalidates existing hashes</li>
        <li><strong>salt</strong> — 16 random bytes, base64-encoded</li>
        <li><strong>hash</strong> — 256-bit derived key, base64-encoded</li>
      </ul>

      <h2>Usage</h2>
      <CodeBlock code={`// Insert — auto-hashed before write
const user = await User.insert({
  email: "alice@example.com",
  password: "correct-horse-battery-staple",
});
// DB stores: pbkdf2$600000$... (never the plaintext)

// Fetch — .verify() attached to the field
const fetched = await User.get({ email: "alice@example.com" });
const match = await fetched.password.verify("correct-horse-battery-staple");
// true

const wrong = await fetched.password.verify("wrong-password");
// false`} filename="src/auth.ts" />

      <h2>Gotcha: <code>.verify()</code> returns a wrapper object</h2>
      <CodeBlock code={`const user = await User.get({ id: 1 });

typeof user.password;            // "string" at runtime (object coercion)
user.password === "pbkdf2$...";  // true — comparison works via valueOf()
user.password.verify("secret");  // ✅ works

// BUT direct === against a plain string literal fails:
if (user.password === "pbkdf2$...") {} // false — different object identity
// Use .verify() instead, or compare via toString()`} filename="src/auth.ts" />

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
            <td><code>Expected 'pbkdf2$iterations$salt$hash' format, got '...'</code></td>
            <td>Stored value doesn't start with <code>pbkdf2$</code></td>
            <td>Verify the column contains a properly hashed value</td>
          </tr>
          <tr>
            <td><code>Expected 'pbkdf2$iterations$salt$hash' (new) or 'pbkdf2$salt$hash' (legacy), got N parts</code></td>
            <td>Malformed stored hash with wrong number of segments</td>
            <td>Re-hash the field by writing to it again</td>
          </tr>
        </tbody>
      </table>

      <h2>Conventions</h2>
      <ul>
        <li>Always use <code>.verify()</code> for password comparison — never compare the raw hash string</li>
        <li>Use <code>@hash:(iterations=N)</code> only for fields that need higher/lower cost than the default</li>
        <li><code>@hash</code> fields are <strong>not</strong> excluded from query results — use <code>@secret</code> if you also need omit behavior</li>
        <li>The iteration count is per-field, encoded in the stored format — raising the global constant only affects new writes</li>
      </ul>

      <h2>See also</h2>
      <ul>
        <li><a href="/docs/annotations/encrypt"><code>@encrypt</code> — two-way encryption</a></li>
        <li><a href="/docs/annotations/secret"><code>@secret</code> — @hash + @omitjson composite</a></li>
      </ul>
    </DocLayout>
  );
}
