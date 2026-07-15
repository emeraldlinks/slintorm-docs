import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';

export const metadata = {
  title: '@hash — SlintORM Annotations',
  description: 'Balloon hashing (memory-hard, default) or PBKDF2 opt-in for SlintORM — .verify() for constant-time comparison, algorithm-gility, and gotchas.',
  alternates: { canonical: '/docs/annotations/hash' },
};

export default function Page() {
  return (
    <DocLayout>
      <h1><code>@hash</code> — Balloon & PBKDF2 Hashing</h1>
      <p>One-way hashes a string field before writing to the database. <strong>Defaults to Balloon Hashing</strong> (memory-hard, SHA-256 based) since v1.9.5. Falls back to PBKDF2 with <code>:(algo=pbkdf2)</code>. Exposes a <code>.verify(plaintext)</code> method for constant-time comparison on read.</p>

      <h2>Syntax</h2>
      <CodeBlock code={`// Balloon Hashing (default — memory-hard, SHA-256)
// space=65536 (2MB), time=3, delta=3
// @hash
password?: string;

// Explicit Balloon with custom params
// @hash:(algo=balloon,space=4096,time=2,delta=2)

// PBKDF2 opt-in (backward compat)
// @hash:(algo=pbkdf2,iterations=600000)
pinHash?: string;`} filename="src/interfaces.ts" />

      <h2>Stored Format</h2>
      <CodeBlock code={`// Balloon (default since v1.9.5):
balloon$<space>$<time>$<delta>$<salt>$<hash>
// Example:
balloon$65536$3$3$Ys0HFPkNgc1aGRp6Y8reug==$uWLzg3CQ...

// PBKDF2 (opt-in):
pbkdf2$<iterations>$<salt>$<hash>
// Example:
pbkdf2$600000$Ys0HFPkNgc1aGRp6Y8reug==$uWLzg3CQtcDZ37JGoVGyor8Qg7yh9BU9sM2jTdilCN0=`} filename="(database column value)" />

      <ul>
        <li><strong>Balloon</strong> — space/time/delta encoded inline; backward-compatible — old PBKDF2 hashes still verify</li>
        <li><strong>PBKDF2</strong> — iterations encoded inline so raising the constant never invalidates existing hashes</li>
        <li><strong>salt</strong> — 16 random bytes, base64-encoded</li>
        <li><strong>hash</strong> — 256-bit derived key, base64-encoded</li>
      </ul>

      <h2>Usage</h2>
      <CodeBlock code={`// Insert — auto-hashed (Balloon) before write
const user = await User.insert({
  email: "alice@example.com",
  password: "correct-horse-battery-staple",
});
// DB stores: balloon$65536$3$3$... (never the plaintext)

// Fetch — .verify() attached to the field
const fetched = await User.get({ email: "alice@example.com" });
const match = await fetched.password.verify("correct-horse-battery-staple");
// true

const wrong = await fetched.password.verify("wrong-password");
// false`} filename="src/auth.ts" />

      <h2>Gotcha: <code>.verify()</code> returns a wrapper object</h2>
      <CodeBlock code={`const user = await User.get({ id: 1 });

typeof user.password;               // "string" at runtime (object coercion)
user.password === "balloon$...";    // true — comparison works via valueOf()
user.password.verify("secret");     // ✅ works

// BUT direct === against a plain string literal fails:
if (user.password === "balloon$...") {} // false — different object identity
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
            <td><code>Expected 'balloon$...' or 'pbkdf2$...' format, got '...'</code></td>
            <td>Stored value doesn't start with recognized prefix</td>
            <td>Verify the column contains a properly hashed value</td>
          </tr>
          <tr>
            <td><code>Expected 'pbkdf2$iterations$salt$hash' (new) or 'pbkdf2$salt$hash' (legacy), got N parts</code></td>
            <td>Malformed PBKDF2 stored hash</td>
            <td>Re-hash the field by writing to it again</td>
          </tr>
        </tbody>
      </table>

      <h2>Conventions</h2>
      <ul>
        <li>Always use <code>.verify()</code> for password comparison — never compare the raw hash string</li>
        <li>Use <code>@hash:(algo=pbkdf2,iterations=N)</code> for PBKDF2 opt-in, or <code>@hash:(algo=balloon,space=N,time=N,delta=N)</code> to tune Balloon cost</li>
        <li><code>@hash</code> fields are <strong>not</strong> excluded from query results — use <code>@secret</code> if you also need omit behavior</li>
        <li>Parameters are per-field, encoded in the stored format — old hashes always verify regardless of current defaults</li>
      </ul>

      <h2>See also</h2>
      <ul>
        <li><a href="/docs/annotations/encrypt"><code>@encrypt</code> — two-way encryption</a></li>
        <li><a href="/docs/annotations/secret"><code>@secret</code> — @hash + @omitjson composite</a></li>
      </ul>
    </DocLayout>
  );
}
