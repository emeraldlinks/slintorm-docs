import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';

export const metadata = {
  title: 'Validation — SlintORM',
  description: "SlintORM validation — FieldRules, validate(), check(), ValidationError, and the Validator class.",
  alternates: { canonical: '/docs/validation' },
};

const validateThrows = `// model.validate(data, rules)
// Throws ValidationError if any rule fails

try {
  await User.validate(
    { email: 'not-an-email', name: '', password: 'abc' },
    {
      email: { required: true, email: true },
      name:  { required: true, minLength: 2 },
      password: { required: true, minLength: 8 },
    }
  );
} catch (err) {
  if (err instanceof ValidationError) {
    console.log(err.message);  // "Validation failed"
    console.log(err.errors);   // { email: "Invalid email", password: "Min length is 8" }
  }
}`;

const checkReturns = `// model.check(data, rules)
// Returns Record<string, string> | null (null = valid)

const errors = await User.check(
  { email: 'joe@example.com', name: 'Joe', password: 'securepass' },
  {
    email:    { required: true, email: true },
    name:     { required: true, minLength: 2, maxLength: 100 },
    password: { required: true, minLength: 8 },
  }
);

if (errors) {
  // Return errors to client
  return res.status(400).json({ errors });
}
// No errors — proceed to insert`;

const allRules = `// FieldRules<T> — all available rule keys

const rules = {
  email: {
    required: true,           // field must be present and non-empty
    email: true,              // must match email pattern
  },
  username: {
    required: true,
    minLength: 3,             // string min length
    maxLength: 30,            // string max length
    match: /^[a-z0-9_]+$/,   // must match regex
  },
  age: {
    required: true,
    min: 18,                  // numeric minimum
    max: 120,                 // numeric maximum
  },
  bio: {
    maxLength: 500,           // optional but max length if present
  },
  referralCode: {
    custom: async (value, row) => {
      // Return an error string, or null/undefined if valid
      const exists = await Referral.exists({ code: value });
      return exists ? null : 'Invalid referral code';
    },
  },
};`;

const customValidator = `// Custom validator function
// (value: unknown, row: Partial<T>) => string | null | Promise<string | null>

const rules = {
  email: {
    required: true,
    email: true,
    custom: async (value) => {
      const taken = await User.exists({ email: value as string });
      return taken ? 'Email already in use' : null;
    },
  },
  username: {
    required: true,
    custom: (value) => {
      const reserved = ['admin', 'root', 'system'];
      return reserved.includes(value as string)
        ? 'Username is reserved'
        : null;
    },
  },
};`;

const inApiRoute = `// app/api/users/route.ts — using check() in a Next.js API route
import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/db';
import { ValidationError } from 'slintorm';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const errors = await User.check(body, {
    email:    { required: true, email: true },
    name:     { required: true, minLength: 2 },
    password: { required: true, minLength: 8 },
  });

  if (errors) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  const user = await User.insert({
    email: body.email,
    name: body.name,
    password: body.password,
  });

  return NextResponse.json({ id: user.id }, { status: 201 });
}`;

const rules = [
  { rule: 'required', type: 'boolean', desc: 'Field must be present and non-empty' },
  { rule: 'email', type: 'boolean', desc: 'Must be a valid email address' },
  { rule: 'minLength', type: 'number', desc: 'String must be at least N characters' },
  { rule: 'maxLength', type: 'number', desc: 'String must be at most N characters' },
  { rule: 'min', type: 'number', desc: 'Numeric value must be >= N' },
  { rule: 'max', type: 'number', desc: 'Numeric value must be <= N' },
  { rule: 'match', type: 'RegExp', desc: 'Value must match the regular expression' },
  { rule: 'custom', type: '(value, row) => string | null', desc: 'Custom validator. Return error string or null. Async supported.' },
];

export default function ValidationPage() {
  return (
    <DocLayout>
      <h1 style={{ marginBottom: '0.5rem' }}>Validation</h1>
      <p style={{ marginBottom: '2rem', fontSize: '1.05rem' }}>
        Every model exposes <code>validate()</code> (throws on failure) and <code>check()</code>
        (returns error map or null). Validation rules are defined per-field using <code>FieldRules&lt;T&gt;</code>.
      </p>

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>validate() — throws ValidationError</h2>
      <CodeBlock code={validateThrows} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>check() — returns error map</h2>
      <CodeBlock code={checkReturns} />

      <h2 style={{ marginBottom: '1rem', marginTop: '2.5rem' }}>FieldRules reference</h2>
      <div style={{ border: '1px solid var(--color-border)', borderRadius: '10px', overflow: 'hidden', marginBottom: '2rem' }}>
        <table>
          <thead>
            <tr>
              <th>Rule</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {rules.map(r => (
              <tr key={r.rule}>
                <td><code>{r.rule}</code></td>
                <td><code style={{ fontSize: '0.8rem', color: '#60A5FA' }}>{r.type}</code></td>
                <td style={{ color: 'var(--color-fg-subtle)' }}>{r.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>All rules example</h2>
      <CodeBlock code={allRules} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>Custom validators</h2>
      <CodeBlock code={customValidator} />

      <h2 style={{ marginBottom: '0.75rem', marginTop: '2rem' }}>In a Next.js API route</h2>
      <CodeBlock code={inApiRoute} filename="app/api/users/route.ts" />
    </DocLayout>
  );
}
