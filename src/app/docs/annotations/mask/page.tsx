import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';

export const metadata = {
  title: '@mask — SlintORM Annotations',
  description: 'Output masking annotation for SlintORM — presets for SSN, credit card, email, phone, and custom directives.',
  alternates: { canonical: '/docs/annotations/mask' },
};

export default function Page() {
  return (
    <DocLayout>
      <h1><code>@mask</code> — Output Masking</h1>
      <p>Masks field values on read using built-in presets or custom directives. The raw value is always stored — masking only affects query results.</p>

      <h2>Syntax</h2>
      <CodeBlock code={`// @mask:<preset>
ssn?: string;          // @mask:ssn
creditCard?: string;   // @mask:creditcard
maskedEmail?: string;  // @mask:email
phoneNumber?: string;  // @mask:phone
showFirst4?: string;   // @mask:showFirst:4
showLast4?: string;    // @mask:showLast:4
starMasked?: string;   // @mask:char:*
patternMasked?: string;// @mask:pattern:###-##-####`} filename="src/interfaces.ts" />

      <h2>Presets</h2>
      <table>
        <thead>
          <tr>
            <th>Preset</th>
            <th>Input</th>
            <th>Output</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><code>ssn</code></td><td><code>987-65-4321</code></td><td><code>***-**-4321</code></td></tr>
          <tr><td><code>creditcard</code></td><td><code>4111-1111-1111-1111</code></td><td><code>****-****-****-1111</code></td></tr>
          <tr><td><code>email</code></td><td><code>john.doe@example.com</code></td><td><code>j*****@example.com</code></td></tr>
          <tr><td><code>phone</code></td><td><code>555-123-4567</code></td><td><code>***-***-4567</code></td></tr>
        </tbody>
      </table>

      <h2>Custom Directives</h2>
      <table>
        <thead>
          <tr>
            <th>Directive</th>
            <th>Input</th>
            <th>Output</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><code>showFirst:N</code></td><td><code>ABCDEFGHIJ</code></td><td><code>ABCD******</code></td></tr>
          <tr><td><code>showLast:N</code></td><td><code>ABCDEFGHIJ</code></td><td><code>******GHIJ</code></td></tr>
          <tr><td><code>char:X</code></td><td><code>secret-value</code></td><td><code>********alue</code></td></tr>
          <tr><td><code>pattern:... </code></td><td><code>123-45-6789</code></td><td><code>###-##-####</code></td></tr>
        </tbody>
      </table>

      <h2>Bypassing Masking</h2>
      <CodeBlock code={`// .withoutMasking() returns raw values for privileged callers
const unmasked = await User.query()
  .withoutMasking()
  .where("name", "=", "Alice")
  .get();
console.log(unmasked[0].ssn);
// "987-65-4321" (raw value)`} filename="src/admin.ts" />

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
            <td>Unknown preset</td>
            <td>Typo in preset name</td>
            <td>Use one of: <code>ssn, creditcard, email, phone</code></td>
          </tr>
          <tr>
            <td>Non-string value masked</td>
            <td>@mask only works on string fields</td>
            <td>Ensure the field type is <code>string</code></td>
          </tr>
        </tbody>
      </table>

      <h2>Conventions</h2>
      <ul>
        <li>Masking is applied on read — the database always stores the full value</li>
        <li>Use <code>.withoutMasking()</code> for admin endpoints or internal use</li>
        <li>Presets are format-aware (e.g. <code>ssn</code> keeps last 4 digits regardless of input format)</li>
      </ul>
    </DocLayout>
  );
}
