import DocLayout from '@/components/DocLayout';
import CodeBlock from '@/components/CodeBlock';

export const metadata = {
  title: '@random — SlintORM Annotations',
  description: '@random annotation for auto-generated field values — string, number, alphanumeric, hex, custom charset, with prefix/suffix options.',
  alternates: { canonical: '/docs/annotations/random' },
};

export default function Page() {
  return (
    <DocLayout>
      <h1><code>@random</code> — Auto-Generated Values</h1>
      <p>Generates random field values on insert. Supports multiple character sets, lengths, and prefix/suffix options. If an explicit value is provided, the annotation is skipped.</p>

      <h2>Syntax</h2>
      <CodeBlock code={`// Colon syntax:
// @random:<type>:<length>
id?: string;           // @random:string:16

// Parenthesized syntax (for extra options):
// @random:<type>(<length>, <options>)
uid?: string;          // @random:string(24)

// Number (returns integer, not string):
pin?: number;          // @random:number:4`} filename="src/interfaces.ts" />

      <h2>Character Set Variants</h2>
      <CodeBlock code={`// Alphanumeric with case control:
upperAlnum?: string;   // @random:alnum(10, upper)
lowerAlnum?: string;   // @random:alnum(10, lower)

// Letters only:
lowerLetters?: string; // @random:lower(12)
upperLetters?: string; // @random:upper(8)

// Hex:
hexStr?: string;       // @random:hex(16)
upperHex?: string;     // @random:hex(16, upper)`} filename="src/interfaces.ts" />

      <h2>Prefix / Suffix</h2>
      <CodeBlock code={`tokenPrefixed?: string; // @random:alnum(8, pfx=TKN_)
invoiceNum?: string;    // @random:number(6, pfx=INV-)
userCode?: string;      // @random:alnum(12, upper, pfx=USR_, sfx=_END)`} filename="src/interfaces.ts" />

      <h2>Custom Charset</h2>
      <CodeBlock code={`// @random:custom(<charset>, <length>)
customPin?: string;     // @random:custom(ABCDEF123456, 6)`} filename="src/interfaces.ts" />

      <h2>Usage</h2>
      <CodeBlock code={`// Insert — values auto-generated
const key = await RandomKeys.insert({
  createdAt: new Date().toISOString(),
});
console.log(key.id);           // "jyAlzGHSigYiqvee" (string:16)
console.log(key.pin);          // 5757 (number)
console.log(key.tokenPrefixed);// "TKN_TCrIn7NZ" (prefixed)

// Provide explicit value — annotation skipped
const explicit = await RandomKeys.insert({
  id: "custom-id-001",
  pin: 9999,
});
console.log(explicit.id);  // "custom-id-001"
console.log(explicit.pin); // 9999`} filename="src/auth.ts" />

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
            <td>Unknown charset type</td>
            <td>Typo in type name</td>
            <td>Use: <code>string, number, alnum, alpha, lower, upper, hex, custom</code></td>
          </tr>
          <tr>
            <td>Length not specified</td>
            <td>Missing length parameter</td>
            <td>Defaults to 32 for strings, 8 for numbers</td>
          </tr>
        </tbody>
      </table>

      <h2>Conventions</h2>
      <ul>
        <li><code>@random:number</code> returns a JavaScript <code>number</code> type; all others return <code>string</code></li>
        <li>Prefixes and suffixes are not counted in the length</li>
        <li>Explicit values always take priority over auto-generation</li>
        <li>Colon syntax (<code>@random:string:16</code>) is simpler; parenthesized syntax (<code>@random:string(16)</code>) enables case control, prefix, suffix, and custom charset</li>
      </ul>
    </DocLayout>
  );
}
