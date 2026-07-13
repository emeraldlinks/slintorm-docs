import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';

export const metadata = {
  title: 'Validation Annotations — SlintORM',
  description: '@email, @url, @uuid, @phone, @min, @max, @minLength, @maxLength, @pattern — field validation annotations for SlintORM.',
  alternates: { canonical: '/docs/annotations/validation' },
};

export default function Page() {
  return (
    <DocLayout>
      <h1>Validation Annotations</h1>
      <p>SlintORM validates annotated fields on every <code>insert()</code> and <code>update()</code>. If validation fails, a <code>ValidationError</code> is thrown with per-field error messages.</p>

      <h2>Format Validators</h2>

      <h3><code>@email</code></h3>
      <CodeBlock code={`// @email
email?: string;

// Valid:   "user@example.com", "a@b.co"
// Invalid: "not-an-email", "@missing.com", "user@.com"`} filename="src/interfaces.ts" />

      <h3><code>@url</code></h3>
      <CodeBlock code={`// @url
url?: string;

// Valid:   "https://example.com", "http://localhost:3000/path?q=1"
// Invalid: "not-a-url", "ftp://..."`} filename="src/interfaces.ts" />

      <h3><code>@uuid</code></h3>
      <CodeBlock code={`// @uuid
uuid?: string;

// Valid:   "550e8400-e29b-41d4-a716-446655440000"
// Invalid: "not-a-uuid", "550e8400-e29b-41d4"`} filename="src/interfaces.ts" />

      <h3><code>@phone</code></h3>
      <CodeBlock code={`// @phone
phone?: string;

// Valid:   "+1-555-123-4567", "5551234567", "(555) 123-4567"
// Invalid: "abc", "12"`} filename="src/interfaces.ts" />

      <h2>Numeric Range</h2>
      <CodeBlock code={`// @min:N — minimum value (inclusive)
// @max:N — maximum value (inclusive)
// @min:0
// @max:120
age: number;

const data = { age: 150 };
await User.validate(data, rules); // throws: "must be at most 120"`} filename="src/interfaces.ts" />

      <h2>String Length</h2>
      <CodeBlock code={`// @minLength:N — minimum string length
// @maxLength:N — maximum string length
// @minLength:2
// @maxLength:100
name: string;`} filename="src/interfaces.ts" />

      <h2>Custom Regex</h2>
      <CodeBlock code={`// @pattern:<regex>
// @pattern:^[A-Za-z0-9_-]+$
status?: string;

// Valid:   "ACTIVE", "pending_review", "DRAFT-1"
// Invalid: "with spaces!", "special@chars"`} filename="src/interfaces.ts" />

      <h2>Validation on Write</h2>
      <CodeBlock code={`try {
  await User.insert({
    name: "X",       // fails @minLength:2
    email: "bad",    // fails @email
    score: 999,      // fails @max:100
  });
} catch (err) {
  if (err instanceof ValidationError) {
    err.message // "Validation failed: must be at least 2 characters; ..."
    err.errors  // { name: "must be at least 2 characters", email: "...", score: "..." }
  }
}

// Updates also validate:
await User.update({ id: 1 }, { email: "not-an-email" });
// throws ValidationError`} filename="src/auth.ts" />

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
            <td><code>ValidationError</code> with field errors</td>
            <td>One or more fields fail their annotation rules</td>
            <td>Check <code>err.errors</code> for per-field messages</td>
          </tr>
          <tr>
            <td><code>must be at least N characters</code></td>
            <td><code>@minLength:N</code> violated</td>
            <td>Provide a longer string</td>
          </tr>
          <tr>
            <td><code>must be a valid email address</code></td>
            <td><code>@email</code> pattern mismatch</td>
            <td>Use a valid email format</td>
          </tr>
          <tr>
            <td><code>must be at most N</code></td>
            <td><code>@max:N</code> exceeded</td>
            <td>Provide a smaller number</td>
          </tr>
        </tbody>
      </table>

      <h2>Conventions</h2>
      <ul>
        <li>Validation runs on <strong>every</strong> insert and update — optional fields skip validation when <code>undefined</code></li>
        <li>Use <code>@pattern:^...$</code> for formats not covered by built-in validators</li>
        <li>Multiple annotations on the same field are separated by <code>;</code></li>
        <li>For manual validation, use <code>User.validate(data, rules)</code> or <code>User.check(data, rules)</code></li>
      </ul>
    </DocLayout>
  );
}
