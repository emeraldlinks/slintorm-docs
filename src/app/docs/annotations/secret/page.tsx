import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';

export const metadata = {
  title: '@secret — SlintORM Annotations',
  description: 'Composite annotation combining @hash + @omitjson — hashed on write, stripped from all read results.',
  alternates: { canonical: '/docs/annotations/secret' },
};

export default function Page() {
  return (
    <DocLayout>
      <h1><code>@secret</code> — @hash + @omitjson Composite</h1>
      <p>Combines <code>@hash</code> (PBKDF2 one-way hashing) and <code>@omitjson</code> (stripped from all read results) into a single annotation. Ideal for API keys, OAuth tokens, webhook signing secrets — values that must be hashed at rest and never returned to callers.</p>

      <h2>Syntax</h2>
      <CodeBlock code={`// @secret — hashed on write, stripped from all reads
apiKey?: string;`} filename="src/interfaces.ts" />

      <h2>Usage</h2>
      <CodeBlock code={`// Create — raw value returned ONCE
const key = await ApiKey.insert({ apiKey: "sk_live_a1b2c3d4e5f6" });
console.log(key.apiKey);
// "sk_live_a1b2c3d4e5f6" ← copy this now!

// Any subsequent read:
const stored = await ApiKey.get({ id: key.id });
console.log(stored.apiKey);
// undefined (stripped by @omitjson)

// The hash is still there internally for verification:
const match = await stored.apiKey.verify("sk_live_a1b2c3d4e5f6");
// true (the hash is retrievable internally, just not serialized)`} filename="src/auth.ts" />

      <h2>How It Works</h2>
      <table>
        <thead>
          <tr>
            <th>Operation</th>
            <th>Behavior</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Insert / Update write</td>
            <td>Value is PBKDF2-hashed via <code>@hash</code> before storage</td>
          </tr>
          <tr>
            <td>get() / getAll() / query()</td>
            <td>Field is stripped from result by <code>@omitjson</code></td>
          </tr>
          <tr>
            <td><code>.toJSON()</code></td>
            <td>Field is excluded from serialized output</td>
          </tr>
          <tr>
            <td>Internal <code>.verify()</code></td>
            <td>The hash stays attached to the entity — <code>.verify(plaintext)</code> works for comparison</td>
          </tr>
        </tbody>
      </table>

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
            <td>Field is <code>undefined</code> on fetched entity</td>
            <td>Expected — @omitjson strips it from reads</td>
            <td>Use <code>.select('apiKey')</code> in query builder if you need the hash</td>
          </tr>
          <tr>
            <td>Logs show the plaintext value</td>
            <td>@secret does NOT redact SQL logs</td>
            <td>Use a separate log filter or avoid logging the field</td>
          </tr>
        </tbody>
      </table>

      <h2>Conventions</h2>
      <ul>
        <li>Use <code>@secret</code> instead of <code>@hash</code> + <code>@omitjson</code> separately — it's the same thing</li>
        <li>The raw value is only available on the insert response — always copy it before proceeding</li>
        <li><strong>Not log-redacted</strong> — contrary to some older docs, @secret does not mask SQL logs. Add application-level log filtering if needed</li>
      </ul>

      <h2>See also</h2>
      <ul>
        <li><a href="/docs/annotations/hash"><code>@hash</code> — one-way hashing</a></li>
        <li><a href="/docs/annotations/encrypt"><code>@encrypt</code> — two-way encryption</a></li>
        <li><a href="/docs/annotations/omit"><code>@omitdb / @omitjson / @omitmigrate</code></a></li>
      </ul>
    </DocLayout>
  );
}
